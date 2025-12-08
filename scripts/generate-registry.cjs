const fs = require("fs");
const path = require("path");

const UI_PATH = path.join(__dirname, "../components/ui");
const OUTPUT_PATH = path.join(__dirname, "../components/ui-registry.tsx");

let content = `// AUTOMATICALLY GENERATED
import * as React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import * as FramerMotion from "framer-motion";
// --- IMPORTS ---
`;

const files = fs
    .readdirSync(UI_PATH)
    .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));
const components = [];

files.forEach((file) => {
    const name = file.replace(/\.tsx?$/, "");
    if (name === "index") return;
    const pascalName = name
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");

    content += `import * as ${pascalName}Module from "@/components/ui/${name}";\n`;
    components.push({ name, pascalName });
});

content += `
export const UI_REGISTRY = {
    cn,
    React,
    LucideIcons,
    FramerMotion,
    // 1. Спочатку іконки (найнижчий пріоритет)
    ...Object.keys(LucideIcons).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = LucideIcons[key];
        return acc;
    }, {} as any),
`;

// 2. Потім компоненти (перезаписують іконки, якщо імена співпадають)
components.forEach(({ pascalName }) => {
    content += `    ...${pascalName}Module,\n`;
    // Додаємо явне посилання на компонент (для default export або named export)
    // Якщо компонент експортується як default, ми беремо default.
    // Якщо ні (наприклад button), ми беремо властивість з таким самим іменем (Button).
    content += `    ${pascalName}: ${pascalName}Module.default || ${pascalName}Module.${pascalName},\n`;
});

// 3. В кінці - примусові оверрайди (Image) - найвищий пріоритет
content += `
   // Next.js Image Override
    Image: (props: any) => {
        // 1. Деструктуризуємо onLoadingComplete, щоб він не потрапив у ...rest
        const { src, alt, fill, width, height, style, className, onClick, priority, loading, onLoadingComplete, onLoad, ...rest } = props;
        
        let styles = { ...style };
        if (fill) {
            styles = { ...styles, position: 'absolute', height: '100%', width: '100%', inset: 0, objectFit: 'cover', color: 'transparent' };
        }

        // 2. Створюємо обробник для native onLoad
        const handleLoad = (e: any) => {
            // Якщо передали звичайний onLoad
            if (onLoad) onLoad(e);

            // Якщо передали Next.js onLoadingComplete
            if (onLoadingComplete) {
                const img = e.target;
                // Next.js повертає об'єкт з розмірами
                onLoadingComplete({
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight
                });
            }
        };

        // ТУТ БУЛА ПОМИЛКА: iframeReact не існує. Використовуємо звичайний JSX.
        return <img 
            src={src} 
            alt={alt || ""} 
            className={cn(className)} 
            style={styles}
            width={fill ? undefined : width} 
            height={fill ? undefined : height}
            loading={priority ? "eager" : "lazy"} 
            decoding="async" 
            onClick={onClick}
            onLoad={handleLoad} 
            {...rest}
        />;
    },


// Next.js Link Override
    Link: (props: any) => {
        const { href, children, ...rest } = props;
        // Ми просто рендеримо <a>.
        // Глобальний скрипт в PreviewFrame перехопить клік і зробить скрол,
        // якщо href починається з #.
        return <a href={href} {...rest}>{children}</a>;
    },
};
`;

fs.writeFileSync(OUTPUT_PATH, content);
console.log(`✅ Fixed Registry generated at ${OUTPUT_PATH}`);

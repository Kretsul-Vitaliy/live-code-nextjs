const fs = require("fs");
const path = require("path");

const UI_PATH = path.join(__dirname, "../components/ui");
const OUTPUT_PATH = path.join(__dirname, "../components/ui-registry.tsx");

let content = `// AUTOMATICALLY GENERATED
"use client";

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
    FramerMotion,
    // ВАЖЛИВО: Експортуємо іконки як об'єкт LucideIcons для компілятора
    LucideIcons,
    // Також розгортаємо їх для прямого доступу (low priority)
    ...Object.keys(LucideIcons).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = LucideIcons[key];
        return acc;
    }, {} as any),

    // --- UI COMPONENTS ---
`;

components.forEach(({ pascalName }) => {
    // 1. Розгортаємо модуль, щоб отримати всі іменовані експорти (DialogTitle, DialogContent і т.д.)
    content += `    ...${pascalName}Module,\n`;

    // 2. Явно вказуємо головний компонент (Dialog, Button)
    // Перевіряємо default, потім іменований експорт з такою ж назвою
    content += `    ${pascalName}: ${pascalName}Module.default || ${pascalName}Module.${pascalName},\n`;
});

content += `
    // --- MANUAL OVERRIDES ---

    Image: (props: any) => {
        const {
            src,
            alt,
            fill,
            width,
            height,
            style,
            className,
            onClick,
            priority,
            loading,
            onLoadingComplete,
            onLoad,
            ...rest
        } = props;
        let styles = { ...style };
        if (fill) {
            styles = {
                ...styles,
                position: "absolute",
                height: "100%",
                width: "100%",
                inset: 0,
                objectFit: "cover",
                color: "transparent",
            };
        }
        const handleLoad = (e: any) => {
            if (onLoad) onLoad(e);
            if (onLoadingComplete) {
                const img = e.target;
                onLoadingComplete({
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                });
            }
        };
        return (
            <img
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
            />
        );
    },

    Link: (props: any) => {
        const { href, children, ...rest } = props;
        return (
            <a href={href} {...rest}>
                {children}
            </a>
        );
    },
};
`;

fs.writeFileSync(OUTPUT_PATH, content);
console.log(`✅ Fixed Registry generated at ${OUTPUT_PATH}`);

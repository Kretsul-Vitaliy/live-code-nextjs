const fs = require("fs");
const path = require("path");

// Шлях до ваших компонентів
const UI_PATH = path.join(__dirname, "../components/ui");
const OUTPUT_PATH = path.join(__dirname, "../components/ui-registry.tsx");

// --- КОНФІГУРАЦІЯ КОМПОНЕНТІВ ---

// 1. Компоненти з variants (cva) -> Native Proxy
// Їм ПОТРІБЕН імпорт, щоб взяти variants
const NATIVE_WITH_VARIANTS = ["button", "badge"];

// 2. Прості нативні компоненти (без variants) -> Native Proxy
// Їм НЕ ПОТРІБЕН імпорт, ми просто створимо тег
const NATIVE_SIMPLE = [
    "input",
    "textarea",
    "checkbox",
    "radio-group",
    "slider",
    "switch",
];

// 3. Компоненти, які є просто div-обгортками (без логіки) -> Div Proxy
const DIV_PROXY = ["card", "skeleton", "label", "separator"];

// Початок файлу
let content = `// ЦЕЙ ФАЙЛ ЗГЕНЕРОВАНО АВТОМАТИЧНО
// Запустіть 'node scripts/generate-registry.js' для оновлення

import * as HostReact from "react";
import { createRoot } from "react-dom/client";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

// --- IMPORTS START ---
`;

// Читаємо файли
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

    // ЛОГІКА ВИПРАВЛЕННЯ:
    // Якщо компонент у списку NATIVE_SIMPLE, ми НЕ додаємо імпорт,
    // тому що ми будемо використовувати createNativeComponent('tag') без посилань на файл.
    if (!NATIVE_SIMPLE.includes(name)) {
        content += `import * as ${pascalName}Comp from "@/components/ui/${name}";\n`;
    }

    components.push({ name, pascalName });
});

content += `
// --- IMPORTS END ---

let iframeReact: any = null;
let iframeReactDOM: any = null;

export const init = (react: any, reactDom: any) => {
    iframeReact = react;
    iframeReactDOM = reactDom;
    console.log("✅ UI Registry Initialized");
};

// --- NATIVE PROXY ---
const createNativeComponent = (tagName: string, variantFunction?: Function) => {
    const ProxyComponent = (props: any) => {
        if (!iframeReact) return null;
        const { className, variant, size, asChild, children, ...rest } = props;
        const computedClass = variantFunction 
            ? cn(variantFunction({ variant, size, className }))
            : cn(className);
        
        // Спеціальна обробка для void елементів
        if (['input', 'hr', 'img', 'br'].includes(tagName)) {
             return iframeReact.createElement(tagName, { className: computedClass, ...rest });
        }

        return iframeReact.createElement(tagName, { className: computedClass, ...rest }, children);
    };
    return ProxyComponent;
};

// --- DIV PROXY ---
const createDivProxy = (baseClass: string) => {
    return (props: any) => {
        if (!iframeReact) return null;
        const { className, ...rest } = props;
        return iframeReact.createElement("div", { className: cn(baseClass, className), ...rest });
    };
};

// --- PORTAL WRAPPER ---
const BridgeSlot = ({ onMount }: { onMount: (node: HTMLElement) => void }) => {
    const ref = HostReact.useRef<HTMLSpanElement>(null);
    HostReact.useLayoutEffect(() => { if (ref.current) onMount(ref.current); }, []);
    return <span ref={ref} style={{ display: "contents" }} />;
};

function createPortalComponent<T extends HostReact.ComponentType<any>>(HostComponent: T) {
    if (!HostComponent) return null;
    const componentName = HostComponent.displayName || HostComponent.name || "Component";

    const InnerComponent = (props: any) => {
        if (!iframeReact || !iframeReactDOM) return null;
        const { useRef, useEffect, useState, createElement } = iframeReact;
        const containerRef = useRef(null);
        const hostRootRef = useRef(null);
        const [childMountNode, setChildMountNode] = useState(null);
        const { children, ...restProps } = props;

        useEffect(() => {
            if (!containerRef.current) return;
            const root = createRoot(containerRef.current);
            hostRootRef.current = root;
            const handleBridgeMount = (node: any) => setChildMountNode(node);

            root.render(HostReact.createElement(
                HostComponent,
                restProps,
                children ? HostReact.createElement(BridgeSlot, { onMount: handleBridgeMount }) : null
            ));
            return () => { setTimeout(() => { if(hostRootRef.current) hostRootRef.current.unmount(); }, 0); };
        }, []);

        useEffect(() => {
            if (hostRootRef.current) {
                const handleBridgeMount = (node: any) => setChildMountNode(node);
                hostRootRef.current.render(HostReact.createElement(
                    HostComponent,
                    restProps,
                    children ? HostReact.createElement(BridgeSlot, { onMount: handleBridgeMount }) : null
                ));
            }
        }, [props]);

        const portalContent = (childMountNode && children)
            ? iframeReactDOM.createPortal(children, childMountNode)
            : null;

        return createElement(
            iframeReact.Fragment,
            null,
            createElement("div", { ref: containerRef, style: { display: "contents" }, "data-portal": componentName }),
            portalContent
        );
    };
    InnerComponent.displayName = \`Portal(\${componentName})\`;
    return InnerComponent;
}

// --- NEXT IMAGE ---
const NextImageEmulation = (props: any) => {
    if (!iframeReact) return null;
    const { src, alt, fill, width, height, style, className, onClick, priority, loading, ...rest } = props;
    let styles: any = { ...style };
    if (fill) {
        styles = { ...styles, position: "absolute", height: "100%", width: "100%", inset: "0px", objectFit: "cover", color: "transparent" };
    }
    return iframeReact.createElement("img", {
        src, alt: alt || "", className: cn(className), style: styles,
        width: fill ? undefined : width, height: fill ? undefined : height,
        loading: priority ? "eager" : "lazy", decoding: "async", onClick, ...rest
    });
};

export const UI_REGISTRY = {
    init: init,
    cn: cn,
    
    // Lucide Icons (Auto)
    ...Object.keys(LucideIcons).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = createPortalComponent(LucideIcons[key]);
        return acc;
    }, {} as any),

    // Overrides
    Image: NextImageEmulation,
`;

// Генерація компонентів
components.forEach(({ name, pascalName }) => {
    // 1. Native Proxy з Variants (Button, Badge)
    if (NATIVE_WITH_VARIANTS.includes(name)) {
        let tagName = "div";
        if (name === "button") tagName = "button";

        content += `    // ${pascalName} (Native Proxy + Variants)\n`;
        content += `    ${pascalName}: createNativeComponent('${tagName}', ${pascalName}Comp.${name}Variants),\n`;
        return;
    }

    // 2. Simple Native Proxy (Input, Checkbox)
    if (NATIVE_SIMPLE.includes(name)) {
        let tagName = "div";
        if (name === "input" || name === "checkbox") tagName = "input";
        if (name === "textarea") tagName = "textarea";

        content += `    // ${pascalName} (Native Simple)\n`;
        // Тут ми більше не використовуємо ${pascalName}Comp, тому імпорт не потрібен
        content += `    ${pascalName}: createNativeComponent('${tagName}'),\n`;
        return;
    }

    // 3. Div Proxy (Card, Label, Separator)
    if (DIV_PROXY.includes(name)) {
        content += `    // ${pascalName} (Div Proxy)\n`;
        content += `    ...Object.keys(${pascalName}Comp).reduce((acc, key) => {
             if(key.includes('Variants')) return acc;
             // @ts-ignore
             acc[key] = createPortalComponent(${pascalName}Comp[key]); 
             return acc;
         }, {} as any),\n`;
        return;
    }

    // 4. Default Strategy (Portal)
    content += `    // ${pascalName} (Portal)\n`;
    content += `    ...Object.keys(${pascalName}Comp).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = createPortalComponent(${pascalName}Comp[key]);
        return acc;
    }, {} as any),\n`;
});

content += `};`;

fs.writeFileSync(OUTPUT_PATH, content);
console.log(
    `✅ UI Registry generated with ${files.length} files at ${OUTPUT_PATH}`
);

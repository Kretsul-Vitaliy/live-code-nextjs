"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { createPortal } from "react-dom";
import { UI_REGISTRY } from "@/components/ui-registry";

// --- ВБУДОВАНІ СТИЛІ ---
// Тут ми вручну налаштовуємо поведінку модалки, щоб вона працювала ідеально
// навіть якщо Tailwind CDN не встигає підхопити динамічні класи.
const SHADCN_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    :root {
        --background: 0 0% 100%;
        --foreground: 240 10% 3.9%;
        --card: 0 0% 100%;
        --card-foreground: 240 10% 3.9%;
        --popover: 0 0% 100%;
        --popover-foreground: 240 10% 3.9%;
        --primary: 240 5.9% 10%;
        --primary-foreground: 0 0% 98%;
        --secondary: 240 4.8% 95.9%;
        --secondary-foreground: 240 5.9% 10%;
        --muted: 240 4.8% 95.9%;
        --muted-foreground: 240 3.8% 46.1%;
        --accent: 240 4.8% 95.9%;
        --accent-foreground: 240 5.9% 10%;
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 0 0% 98%;
        --border: 240 5.9% 90%;
        --input: 240 5.9% 90%;
        --ring: 240 10% 3.9%;
        --radius: 0.5rem;
    }

    body { 
        font-family: 'Inter', sans-serif; 
        background-color: white; 
        margin: 0;
        padding: 1rem;
        width: 100vw;
        min-height: 100vh;
        overflow-x: hidden; 
    }

    /* --- МОДАЛЬНЕ ВІКНО (Critical Fix) --- */
    /* Базові стилі для всіх розмірів */
    [data-slot="dialog-content"],
    div[role="dialog"][data-state] {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 50 !important;
        
        /* Мобільна поведінка за замовчуванням */
        width: 95% !important;
        max-width: 100% !important; 
        margin: 0 auto;
        
        background-color: white;
        border-radius: var(--radius);
        border: 1px solid hsl(var(--border));
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    /* Адаптивність: Якщо ширина iframe > 640px, обмежуємо ширину */
    @media (min-width: 640px) {
        [data-slot="dialog-content"],
        div[role="dialog"][data-state] {
            width: 100% !important;
            max-width: 520px !important; /* Ваше бажане обмеження */
        }
        
        /* Виняток для галереї (якщо клас max-w-6xl присутній, дозволяємо ширше) */
        [data-slot="dialog-content"].max-w-6xl {
            max-width: 72rem !important; /* 6xl = 72rem */
        }
    }

    /* Затемнення фону */
    [data-slot="dialog-overlay"],
    div[data-state="open"] + div.fixed.inset-0 {
        position: fixed !important;
        inset: 0 !important;
        background-color: rgba(0,0,0,0.5);
        z-index: 49 !important;
        backdrop-filter: blur(2px);
    }

    .rdp { margin: 0; position: relative; z-index: 50; }
    [data-radix-popper-content-wrapper] { z-index: 100 !important; }
`;

const IFRAME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>${SHADCN_STYLES}</style>
    <script>
        window.tailwind = {
            config: {
                corePlugins: { preflight: true },
                theme: {
                    extend: {
                        colors: { border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))", background: "hsl(var(--background))", foreground: "hsl(var(--foreground))", primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }, secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" }, destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" }, muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" }, accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" }, popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" }, card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" } },
                        borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" }
                    }
                }
            }
        }
    </script>
</head>
<body><div id="root"></div></body>
</html>`;

interface PreviewProps {
    code: string;
    renderKey: number;
}

function PreviewFrame({ code, renderKey }: PreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [Component, setComponent] = useState<React.ComponentType | null>(
        null
    );
    const [iframeReady, setIframeReady] = useState(false);

    useEffect(() => {
        // @ts-ignore
        if (!window.PreviewUI) window.PreviewUI = UI_REGISTRY;
    }, []);

    const handleIframeLoad = (
        e: React.SyntheticEvent<HTMLIFrameElement, Event>
    ) => {
        const doc = e.currentTarget.contentDocument;
        if (doc) {
            // @ts-ignore
            e.currentTarget.contentWindow.PreviewUI = UI_REGISTRY;
            // @ts-ignore
            e.currentTarget.contentWindow.React = UI_REGISTRY.React;

            const root = doc.getElementById("root");
            if (root) {
                setMountNode(root);
                setIframeReady(true);
            }
        }
    };

    // Авто-визначення завантаження
    useEffect(() => {
        const iframe = iframeRef.current;
        if (
            iframe &&
            iframe.contentDocument &&
            !iframeReady &&
            iframe.contentDocument.readyState === "complete"
        ) {
            // @ts-ignore
            if (iframe.contentWindow) {
                // @ts-ignore
                iframe.contentWindow.PreviewUI = UI_REGISTRY;
                // @ts-ignore
                iframe.contentWindow.React = UI_REGISTRY.React;
            }
            const root = iframe.contentDocument.getElementById("root");
            if (root) {
                setMountNode(root);
                setIframeReady(true);
            }
        }
    }, []);

    // Виконання коду
    useEffect(() => {
        if (!code || !iframeReady || !mountNode || !iframeRef.current) return;
        const win = iframeRef.current.contentWindow as any;
        if (!win) return;

        try {
            setError(null);
            win.DefaultExport = undefined;
            win.LastExportedComponent = undefined;

            // Виконуємо код
            win.eval(code);

            const Exported = win.DefaultExport || win.LastExportedComponent;

            if (Exported) {
                setComponent(() => Exported);
            } else {
                console.warn("No export found");
            }
        } catch (err: any) {
            console.error("Execution Error:", err);
            setError(err.message);
        }
    }, [code, iframeReady, renderKey, mountNode]);

    return (
        <div className="w-full h-full relative bg-white isolate">
            <iframe
                ref={iframeRef}
                srcDoc={IFRAME_HTML}
                onLoad={handleIframeLoad}
                className="w-full h-full border-0 absolute inset-0"
                title="preview"
                sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms"
            />
            {error && (
                <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-xs font-mono z-50">
                    {error}
                </div>
            )}
            {mountNode &&
                Component &&
                createPortal(
                    <div key={renderKey} className="min-h-full">
                        <Component />
                    </div>,
                    mountNode
                )}
        </div>
    );
}

export default memo(PreviewFrame);

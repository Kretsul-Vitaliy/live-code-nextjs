"use client";
import React, {
    useEffect,
    useRef,
    useState,
    memo,
    Component,
    ErrorInfo,
    ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { UI_REGISTRY } from "@/components/ui-registry";
import { AlertTriangle, Loader2 } from "lucide-react";

// --- 1. ERROR BOUNDARY (Запобіжник від крашу всієї сторінки) ---
interface ErrorBoundaryProps {
    children: ReactNode;
    resetKey: number; // Ключ для скидання стану помилки при зміні коду
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Preview Component Crashed:", error, errorInfo);
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        // Якщо код змінився (новий renderKey), скидаємо помилку
        if (prevProps.resetKey !== this.props.resetKey) {
            this.setState({ hasError: false, error: null });
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full shadow-sm">
                        <div className="flex items-center gap-2 text-red-600 font-semibold mb-2 justify-center">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Runtime Error</span>
                        </div>
                        <p className="text-sm text-gray-700 font-mono text-left whitespace-pre-wrap break-words bg-white p-3 rounded border border-red-100 max-h-40 overflow-auto">
                            {this.state.error?.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Check your browser console for full stack trace.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// --- 2. СТИЛІ ТА HTML (Без змін) ---
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
        padding: 0; /* Прибираємо padding для full-width */
        width: 100vw;
        min-height: 100vh;
        overflow-x: hidden; 
        position: relative;
    }

    /* --- МОДАЛЬНЕ ВІКНО FIX --- */
    [data-radix-portal] { position: fixed; inset: 0; z-index: 50; pointer-events: none; }
    [data-radix-portal] > * { pointer-events: auto; }

    [data-slot="dialog-content"],
    div[role="dialog"][data-state] {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 50 !important;
        width: 95% !important;
        max-width: 100% !important; 
        margin: 0 auto;
        background-color: white;
        border-radius: var(--radius);
        border: 1px solid hsl(var(--border));
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 640px) {
        [data-slot="dialog-content"],
        div[role="dialog"][data-state] {
            width: 100% !important;
            max-width: 520px !important;
        }
        [data-slot="dialog-content"].max-w-6xl {
            max-width: 72rem !important;
        }
    }

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

    /* --- SHADCN ANIMATIONS (Polyfill for tailwindcss-animate in CDN) --- */
    @keyframes enter {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes exit {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
    }
    
    .animate-in { animation: enter 0.15s ease-out; }
    .animate-out { animation: exit 0.15s ease-in; }
    
    .fade-in-0 { opacity: 0; animation-name: enter; }
    .fade-out-0 { opacity: 1; animation-name: exit; }
    
    .zoom-in-95 { transform: scale(0.95); }
    .zoom-out-95 { transform: scale(0.95); }
    
    /* Специфічні класи для Dialog з dialog.tsx */
    [data-state="open"].animate-in {
        animation: enter 0.2s ease-out forwards;
    }
    [data-state="closed"].animate-out {
        animation: exit 0.2s ease-in forwards;
    }
        
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

// --- 3. ГОЛОВНИЙ КОМПОНЕНТ ---
function PreviewFrame({ code, renderKey }: PreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [Component, setComponent] = useState<React.ComponentType | null>(
        null
    );
    const [iframeReady, setIframeReady] = useState(false);

    // Функція для ін'єкції глобальних змінних
    const injectGlobals = (win: any) => {
        if (!win) return;
        win.PreviewUI = UI_REGISTRY;

        // ВАЖЛИВО: Робимо хуки доступними глобально, щоб працював код без import { useRef } from 'react'
        win.React = UI_REGISTRY.React;
        win.useState = UI_REGISTRY.React.useState;
        win.useEffect = UI_REGISTRY.React.useEffect;
        win.useRef = UI_REGISTRY.React.useRef;
        win.useMemo = UI_REGISTRY.React.useMemo;
        win.useCallback = UI_REGISTRY.React.useCallback;
        win.useContext = UI_REGISTRY.React.useContext;
        win.useReducer = UI_REGISTRY.React.useReducer;
        win.useLayoutEffect = UI_REGISTRY.React.useLayoutEffect;
    };

    const handleIframeLoad = (
        e: React.SyntheticEvent<HTMLIFrameElement, Event>
    ) => {
        const iframe = e.currentTarget;
        const win = iframe.contentWindow;
        const doc = iframe.contentDocument;

        if (win && doc) {
            injectGlobals(win);
            const root = doc.getElementById("root");
            if (root) {
                setMountNode(root);
                setIframeReady(true);
            }
        }
    };

    // Fallback для повторного завантаження
    useEffect(() => {
        const iframe = iframeRef.current;
        if (
            iframe &&
            iframe.contentDocument &&
            !iframeReady &&
            iframe.contentDocument.readyState === "complete"
        ) {
            injectGlobals(iframe.contentWindow);
            const root = iframe.contentDocument.getElementById("root");
            if (root) {
                setMountNode(root);
                setIframeReady(true);
            }
        }
    }, []);

    // Виконання коду (Eval)
    useEffect(() => {
        if (!code || !iframeReady || !mountNode || !iframeRef.current) return;
        const win = iframeRef.current.contentWindow as any;
        if (!win) return;

        try {
            setError(null);

            // Скидаємо попередні експорти
            win.DefaultExport = undefined;
            win.LastExportedComponent = undefined;

            // Виконуємо код у try-catch блоці (це ловить синтаксичні помилки та reference errors)
            win.eval(code);

            const Exported = win.DefaultExport || win.LastExportedComponent;

            if (Exported) {
                setComponent(() => Exported);
            } else {
                console.warn("No export found");
                // Не ставимо помилку, можливо код просто пустий або ще пишеться
            }
        } catch (err: any) {
            console.error("Eval Error:", err);
            // Виводимо помилку гарно, а не крашимо додаток
            setError(err.message);
            setComponent(null);
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

            {/* Шар помилок Eval (Синтаксис) */}
            {error && (
                <div className="absolute inset-0 z-50 bg-white/95 flex items-start justify-center pt-20 p-4">
                    <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-red-600 font-semibold mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Compilation Error</span>
                        </div>
                        <pre className="text-xs text-red-800 whitespace-pre-wrap break-words font-mono">
                            {error}
                        </pre>
                    </div>
                </div>
            )}

            {/* Рендер через Portal + ErrorBoundary */}
            {mountNode &&
                Component &&
                !error &&
                createPortal(
                    <ErrorBoundary resetKey={renderKey}>
                        <div key={renderKey} className="min-h-full">
                            <Component />
                        </div>
                    </ErrorBoundary>,
                    mountNode
                )}
        </div>
    );
}

export default memo(PreviewFrame);

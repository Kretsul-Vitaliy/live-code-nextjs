"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { createPortal } from "react-dom";
import { UI_REGISTRY } from "@/components/ui-registry";

declare global {
    interface Window {
        DefaultExport?: any;
        LastExportedComponent?: any;
    }
}

// --- CSS ІН'ЄКЦІЯ (ВИПРАВЛЯЄ КАЛЕНДАР, МОДАЛКИ, ШРИФТИ) ---
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

    html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    body { font-family: 'Inter', sans-serif; overflow-x: hidden; overflow-y: auto; background-color: white; padding: 1rem; }
    
    /* --- FIX: CALENDAR (RDP) --- */
    .rdp {
        margin: 0;
        position: relative;
        z-index: 50;
        background-color: white;
        border-radius: var(--radius);
        padding: 10px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .rdp-month { background-color: white; }
    .rdp-day_selected:not([disabled]) { 
        background-color: hsl(var(--primary)); 
        color: hsl(var(--primary-foreground));
    }
    
    /* --- FIX: POPOVER/DROPDOWN --- */
    [data-radix-popper-content-wrapper] {
        z-index: 100 !important;
        background-color: white;
    }

    /* --- FIX: DIALOG/MODAL --- */
    /* ВИПРАВЛЕННЯ: Додано "div" та "data-state" для підвищення специфічності (Specificity Wars).
       Це гарантує, що наші стилі переб'ють Tailwind клас ".w-full", який є у компоненті.
    */
    div[role="dialog"][data-state], 
    [data-radix-popper-content-wrapper] [role="dialog"] {
        position: fixed;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 51;
        
        /* Примусові розміри */
        width: 90% !important; 
        max-width: 520px !important;
        
        background-color: white;
        border: 1px solid hsl(var(--border));
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        max-height: 90vh;
        overflow-y: auto;
    }
    
    /* Overlay */
    [data-state="open"] + div, [data-state="open"] > .fixed.inset-0 {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 50;
        backdrop-filter: blur(1px);
    }
    
    /* Animations */
    @keyframes enter { from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
    .animate-in { animation: enter 0.2s ease-out forwards; }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
`;

const IFRAME_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><style>${SHADCN_STYLES}</style><script>window.tailwind={config:{corePlugins:{preflight:true},theme:{extend:{colors:{border:"hsl(var(--border))",input:"hsl(var(--input))",ring:"hsl(var(--ring))",background:"hsl(var(--background))",foreground:"hsl(var(--foreground))",primary:{DEFAULT:"hsl(var(--primary))",foreground:"hsl(var(--primary-foreground))"},secondary:{DEFAULT:"hsl(var(--secondary))",foreground:"hsl(var(--secondary-foreground))"},destructive:{DEFAULT:"hsl(var(--destructive))",foreground:"hsl(var(--destructive-foreground))"},muted:{DEFAULT:"hsl(var(--muted))",foreground:"hsl(var(--muted-foreground))"},accent:{DEFAULT:"hsl(var(--accent))",foreground:"hsl(var(--accent-foreground))"},popover:{DEFAULT:"hsl(var(--popover))",foreground:"hsl(var(--popover-foreground))"},card:{DEFAULT:"hsl(var(--card))",foreground:"hsl(var(--card-foreground))"}},borderRadius:{lg:"var(--radius)",md:"calc(var(--radius) - 2px)",sm:"calc(var(--radius) - 4px)"}}}}}</script><script>document.addEventListener('click',function(e){const link=e.target.closest('a');if(!link)return;const href=link.getAttribute('href');e.preventDefault();if(href&&href.startsWith('#')){const id=href.substring(1);const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}else{console.log('🔒 Nav blocked:',href)}},true);</script></head><body><div id="root"></div></body></html>`;

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
        if (doc?.getElementById("root")) {
            setMountNode(doc.getElementById("root"));
            setIframeReady(true);
        }
    };

    useEffect(() => {
        if (!code || !iframeReady) return;

        try {
            setError(null);
            // @ts-ignore
            window.DefaultExport = null;
            // @ts-ignore
            window.LastExportedComponent = null;

            const func = new Function(code);
            func();

            // @ts-ignore
            const Exported =
                window.DefaultExport || window.LastExportedComponent;
            if (Exported) {
                setComponent(() => Exported);
            } else {
                console.warn("No export found in code");
            }
        } catch (err: any) {
            console.error("Eval Error:", err);
            setError(err.message);
        }
    }, [code, iframeReady, renderKey]);

    return (
        <div className="w-full h-full relative bg-white isolate">
            <iframe
                ref={iframeRef}
                srcDoc={IFRAME_HTML}
                onLoad={handleIframeLoad}
                className="w-full h-full border-0 absolute inset-0"
                title="preview"
                sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
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

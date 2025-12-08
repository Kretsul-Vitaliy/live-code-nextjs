"use client";

import { useState, useEffect, useRef } from "react";
import {
    Smartphone,
    Tablet,
    Monitor,
    Code2,
    PanelLeftClose,
    PanelLeftOpen,
    Play,
    RotateCcw,
    Layout,
} from "lucide-react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    type ImperativePanelHandle,
} from "@/components/ui/resizable";
import PreviewFrame from "@/components/PreviewFrame";
import { compileCode } from "@/lib/compiler";
import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Початковий код
const INITIAL_CODE = `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="p-10 flex justify-center bg-slate-50 min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="text-blue-500" />
            Hello World
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Count: {count}
          </p>
          <Button onClick={() => setCount(c => c + 1)} className="w-full">
             Increment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}`;

type DeviceSize = "mobile" | "tablet" | "desktop" | "full";

const SIZES: Record<DeviceSize, string> = {
    mobile: "375px",
    tablet: "768px",
    desktop: "1024px",
    full: "100%",
};

export default function CodeBrowser() {
    const [inputCode, setInputCode] = useState(INITIAL_CODE);

    // ВИПРАВЛЕННЯ 1: Компілюємо код одразу при ініціалізації state.
    // Це вирішує проблему пустого екрану при старті.
    const [compiledJs, setCompiledJs] = useState(() => {
        const { code } = compileCode(INITIAL_CODE);
        return code || "";
    });

    // UI State
    const [previewSize, setPreviewSize] = useState<DeviceSize>("full");
    const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);

    // Keys
    const [iframeKey, setIframeKey] = useState(0); // Повне перезавантаження iframe
    const [renderKey, setRenderKey] = useState(0); // Оновлення React компонента

    const editorPanelRef = useRef<ImperativePanelHandle>(null);

    // Live Preview (Debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            const { code, error } = compileCode(inputCode);
            if (!error && code) {
                setCompiledJs(code);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [inputCode]);

    // ВИПРАВЛЕННЯ 2: Функція Run тепер примусово оновлює renderKey
    const handleRun = () => {
        const { code, error } = compileCode(inputCode);
        if (!error && code) {
            setCompiledJs(code);
            // Інкремент ключа змушує PreviewFrame знищити і створити компонент заново
            setRenderKey((prev) => prev + 1);
        }
    };

    const handleReset = () => {
        setIframeKey((k) => k + 1);
        handleRun(); // Перекомпілювати після скидання iframe
    };

    const toggleEditor = () => {
        const panel = editorPanelRef.current;
        if (panel) {
            if (isEditorCollapsed) {
                panel.expand();
                setIsEditorCollapsed(false);
            } else {
                panel.collapse();
                setIsEditorCollapsed(true);
            }
        }
    };

    return (
        <TooltipProvider>
            <div className="h-screen w-full bg-background flex flex-col overflow-hidden font-sans">
                {/* --- HEADER --- */}
                <header className="h-14 border-b flex items-center justify-between px-4 bg-background z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="font-bold text-lg flex items-center gap-2 text-primary tracking-tight">
                            <Code2 className="w-6 h-6 text-blue-600" />
                            <span>LiveCompiler</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleEditor}
                            className="text-muted-foreground hover:text-foreground"
                            title={
                                isEditorCollapsed
                                    ? "Show Editor"
                                    : "Hide Editor"
                            }>
                            {isEditorCollapsed ? (
                                <PanelLeftOpen size={18} />
                            ) : (
                                <PanelLeftClose size={18} />
                            )}
                        </Button>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-md border border-border/50">
                        <DeviceBtn
                            active={previewSize === "mobile"}
                            onClick={() => setPreviewSize("mobile")}
                            icon={<Smartphone size={16} />}
                            label="Mobile"
                        />
                        <DeviceBtn
                            active={previewSize === "tablet"}
                            onClick={() => setPreviewSize("tablet")}
                            icon={<Tablet size={16} />}
                            label="Tablet"
                        />
                        <DeviceBtn
                            active={previewSize === "desktop"}
                            onClick={() => setPreviewSize("desktop")}
                            icon={<Monitor size={16} />}
                            label="Desktop"
                        />
                        <div className="w-px h-4 bg-border mx-1" />
                        <DeviceBtn
                            active={previewSize === "full"}
                            onClick={() => setPreviewSize("full")}
                            icon={<Layout size={16} />}
                            label="Fluid"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleReset}
                            className="gap-2 text-muted-foreground hover:text-foreground">
                            <RotateCcw size={14} />
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleRun}
                            className="gap-2 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm">
                            <Play size={14} fill="currentColor" />
                            Run
                        </Button>
                    </div>
                </header>

                {/* --- MAIN --- */}
                <main className="flex-1 overflow-hidden relative">
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel
                            ref={editorPanelRef}
                            defaultSize={40}
                            minSize={20}
                            maxSize={80}
                            collapsible={true}
                            onCollapse={() => setIsEditorCollapsed(true)}
                            onExpand={() => setIsEditorCollapsed(false)}
                            className={cn(
                                "bg-[#1e1e1e] flex flex-col border-r border-border transition-all duration-300 ease-in-out",
                                isEditorCollapsed && "min-w-0 w-0 border-none"
                            )}>
                            <CodeEditor
                                code={inputCode}
                                onChange={setInputCode}
                            />
                        </ResizablePanel>

                        <ResizableHandle
                            withHandle
                            className="bg-border hover:bg-blue-500 w-1 transition-colors"
                        />

                        <ResizablePanel defaultSize={60}>
                            <div className="h-full w-full bg-gray-100/50 relative flex flex-col">
                                <div className="flex-1 overflow-auto flex items-start justify-center p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                    <div
                                        className={cn(
                                            "bg-white shadow-2xl transition-all duration-300 ease-in-out overflow-hidden relative origin-top",
                                            previewSize === "full"
                                                ? "w-full h-full rounded-none border-0 shadow-none"
                                                : "border border-gray-200"
                                        )}
                                        style={{
                                            width: SIZES[previewSize],
                                            height:
                                                previewSize === "full"
                                                    ? "100%"
                                                    : "850px",
                                            borderRadius:
                                                previewSize === "full"
                                                    ? 0
                                                    : previewSize === "mobile"
                                                    ? "40px"
                                                    : "12px",
                                            borderWidth:
                                                previewSize === "mobile"
                                                    ? "12px"
                                                    : previewSize === "full"
                                                    ? "0px"
                                                    : "1px",
                                            borderColor:
                                                previewSize === "mobile"
                                                    ? "#2d2d2d"
                                                    : "#e5e7eb",
                                        }}>
                                        {previewSize === "mobile" && (
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-[#2d2d2d] rounded-b-xl z-20 pointer-events-none" />
                                        )}

                                        <PreviewFrame
                                            key={iframeKey}
                                            code={compiledJs}
                                            renderKey={renderKey}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </main>
            </div>
        </TooltipProvider>
    );
}

function DeviceBtn({ active, onClick, icon, label }: any) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    className={cn(
                        "p-2 rounded-sm transition-all duration-200 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background",
                        active &&
                            "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                    )}>
                    {icon}
                </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
                {label}
            </TooltipContent>
        </Tooltip>
    );
}

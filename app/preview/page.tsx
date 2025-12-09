"use client";

import React, { useEffect, useState } from "react";
import PreviewFrame from "@/components/PreviewFrame";
import { compileCode } from "@/lib/compiler";
import { Loader2 } from "lucide-react";

export default function StandalonePreview() {
    const [code, setCode] = useState<string>("");
    const [renderKey, setRenderKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Слухаємо повідомлення від батьківського вікна (Generators, Editors)
        const handleMessage = (event: MessageEvent) => {
            // ПЕРЕВІРКА БЕЗПЕКИ: Розкоментуйте та налаштуйте origin у продакшені
            // if (event.origin !== "https://your-generator-app.com") return;

            const { type, code: rawCode } = event.data;

            if (type === "UPDATE_CODE" && rawCode) {
                setLoading(true);
                try {
                    const { code: compiled, error: compileError } =
                        compileCode(rawCode);

                    if (compileError) {
                        setError(compileError);
                    } else {
                        setCode(compiled || "");
                        setError(null);
                        setRenderKey((prev) => prev + 1); // Перемальовуємо
                    }
                } catch (e: any) {
                    setError(e.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        window.addEventListener("message", handleMessage);

        // Повідомляємо батька, що ми готові приймати код
        window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

        return () => window.removeEventListener("message", handleMessage);
    }, []);

    if (!code && loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white text-sm text-gray-500 gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Waiting for code...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 font-mono text-xs h-screen w-full overflow-auto">
                <strong>Compilation Error:</strong>
                <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-white">
            <PreviewFrame code={code} renderKey={renderKey} />
        </div>
    );
}

// // Код на стороні вашого генератора (інший проект або сторінка)
// const iframe = document.getElementById('preview-iframe');

// // Відправка коду
// iframe.contentWindow.postMessage({
//   type: 'UPDATE_CODE',
//   code: `import React from 'react'; export default function Test() { return <h1>Hello from Generator</h1> }`
// }, '*');

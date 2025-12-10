// "use client";

// import React, { useEffect, useState } from "react";
// import PreviewFrame from "@/components/PreviewFrame";
// import { compileCode } from "@/lib/compiler";
// import { Loader2 } from "lucide-react";

// export default function StandalonePreview() {
//     const [code, setCode] = useState<string>("");
//     const [renderKey, setRenderKey] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         // Слухаємо повідомлення від батьківського вікна (Generators, Editors)
//         const handleMessage = (event: MessageEvent) => {
//             // ПЕРЕВІРКА БЕЗПЕКИ: Розкоментуйте та налаштуйте origin у продакшені
//             // if (event.origin !== "https://your-generator-app.com") return;

//             const { type, code: rawCode } = event.data;

//             if (type === "UPDATE_CODE" && rawCode) {
//                 setLoading(true);
//                 try {
//                     const { code: compiled, error: compileError } =
//                         compileCode(rawCode);

//                     if (compileError) {
//                         setError(compileError);
//                     } else {
//                         setCode(compiled || "");
//                         setError(null);
//                         setRenderKey((prev) => prev + 1); // Перемальовуємо
//                     }
//                 } catch (e: any) {
//                     setError(e.message);
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         };

//         window.addEventListener("message", handleMessage);

//         // Повідомляємо батька, що ми готові приймати код
//         window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

//         return () => window.removeEventListener("message", handleMessage);
//     }, []);

//     if (!code && loading) {
//         return (
//             <div className="flex h-screen w-full items-center justify-center bg-white text-sm text-gray-500 gap-2">
//                 <Loader2 className="animate-spin w-4 h-4" />
//                 Waiting for code...
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="p-4 bg-red-50 text-red-600 font-mono text-xs h-screen w-full overflow-auto">
//                 <strong>Compilation Error:</strong>
//                 <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full h-screen bg-white">
//             <PreviewFrame code={code} renderKey={renderKey} />
//         </div>
//     );
// }

"use client";

import React, { useEffect, useState } from "react";
import PreviewFrame from "@/components/PreviewFrame"; // Перевірте шлях до компонента
import { compileCode } from "@/lib/compiler"; // Перевірте шлях до компілятора
import { Loader2 } from "lucide-react";

export default function StandalonePreview() {
    const [code, setCode] = useState<string>("");
    const [renderKey, setRenderKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Слухаємо вхідний код
        const handleMessage = (event: MessageEvent) => {
            const { type, code: rawCode } = event.data;

            // Логуємо для перевірки
            if (type) console.log("[Preview Page] Received message:", type);

            if (type === "UPDATE_CODE" && rawCode) {
                setLoading(true);
                try {
                    console.log("[Preview Page] Compiling code...");
                    const { code: compiled, error: compileError } =
                        compileCode(rawCode);

                    if (compileError) {
                        setError(compileError);
                        window.parent.postMessage(
                            {
                                type: "RENDER_STATUS",
                                status: "error",
                                error: compileError,
                            },
                            "*"
                        );
                    } else {
                        setCode(compiled || "");
                        setError(null);
                        setRenderKey((prev) => prev + 1);

                        // Повідомляємо батька, що ми успішно отримали і скомпілювали код
                        window.parent.postMessage(
                            { type: "RENDER_STATUS", status: "success" },
                            "*"
                        );
                    }
                } catch (e: any) {
                    setError(e.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        window.addEventListener("message", handleMessage);

        // 2. ВАЖЛИВО: "Рукостискання" (Handshake)
        // Ми повинні сказати Відправнику, що ми готові.
        // Відправляємо обидва варіанти ("ready" і "RENDER_READY"), щоб точно спрацювало.
        const sendReadySignal = () => {
            console.log("[Preview Page] Sending RENDER_READY...");
            window.parent.postMessage({ type: "ready" }, "*"); // Для старих версій
            window.parent.postMessage({ type: "RENDER_READY" }, "*"); // Для нових версій (v0)
        };

        // Відправляємо сигнал одразу
        sendReadySignal();

        // І повторюємо кожні 500мс, доки не отримаємо код (на випадок затримок мережі)
        const intervalId = setInterval(() => {
            if (!code) {
                sendReadySignal();
            } else {
                clearInterval(intervalId); // Зупиняємо таймер, коли код отримано
            }
        }, 500);

        return () => {
            window.removeEventListener("message", handleMessage);
            clearInterval(intervalId);
        };
    }, [code]);

    // Відображення стану завантаження
    if (!code && loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white text-sm text-gray-500 gap-2 font-sans">
                <Loader2 className="animate-spin w-4 h-4 text-blue-600" />
                <span>Waiting for code...</span>
            </div>
        );
    }

    // Відображення помилки компіляції
    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 font-mono text-xs h-screen w-full overflow-auto">
                <strong>Compilation Error:</strong>
                <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
            </div>
        );
    }

    // Відображення результату
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

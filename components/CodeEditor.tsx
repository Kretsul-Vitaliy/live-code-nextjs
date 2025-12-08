"use client";
import React from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";

interface CodeEditorProps {
    code: string;
    onChange: (value: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
    const handleEditorChange: OnChange = (value) => {
        if (value !== undefined) {
            onChange(value);
        }
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // ВИМИКАЄМО ВАЛІДАЦІЮ (Червоні хвилі)
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
        });

        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
        });

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.React,
            jsxFactory: "React.createElement",
            reactNamespace: "React",
            allowNonTsExtensions: true,
            target: monaco.languages.typescript.ScriptTarget.Latest,
        });
    };

    return (
        <div className="flex-1 w-full h-full">
            <Editor
                height="100%"
                width="100%"
                language="typescript"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true, // Важливо для ресайзу
                    padding: { top: 16 },
                    fontFamily: "'Fira Code', monospace",
                    tabSize: 2,
                }}
            />
        </div>
    );
}

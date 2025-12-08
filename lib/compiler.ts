import * as Babel from "@babel/standalone";

// 1. Плагін для очищення коду від "use client" (Безпечний метод через Visitor)
const RemoveUseClientPlugin = () => ({
    visitor: {
        Directive(path: any) {
            if (path.node.value.value === "use client") {
                path.remove();
            }
        },
    },
});

// 2. Плагін для трансформації імпортів
const TransformImportsToRegistryPlugin = ({ types: t }: any) => ({
    visitor: {
        Program: {
            exit(path: any) {
                path.scope.crawl();

                // Перевіряємо, чи є в області видимості змінна React.
                // Якщо ні (наприклад, користувач пише <div /> без імпорту React),
                // ми додаємо const React = window.PreviewUI.React;
                if (!path.scope.hasBinding("React")) {
                    const reactDeclaration = t.variableDeclaration("const", [
                        t.variableDeclarator(
                            t.identifier("React"),
                            t.memberExpression(
                                t.memberExpression(
                                    t.identifier("window"),
                                    t.identifier("PreviewUI")
                                ),
                                t.identifier("React")
                            )
                        ),
                    ]);
                    // Додаємо на початок файлу
                    path.node.body.unshift(reactDeclaration);
                }
            },
        },
        ImportDeclaration(path: any) {
            // Ігноруємо import type ...
            if (path.node.importKind === "type") {
                path.remove();
                return;
            }

            const source = path.node.source.value;

            // Ігноруємо відносні імпорти (вони не підтримуються в цьому середовищі)
            if (source.startsWith(".") || source.startsWith("/")) {
                path.remove();
                return;
            }

            // Базовий вираз: window.PreviewUI
            const previewUIExpression = t.memberExpression(
                t.identifier("window"),
                t.identifier("PreviewUI")
            );

            let memberExpression: any = previewUIExpression;
            let isReact = false;

            // Мапінг бібліотек
            if (source === "react") {
                isReact = true;
                memberExpression = t.memberExpression(
                    previewUIExpression,
                    t.identifier("React")
                );
            } else if (source === "lucide-react") {
                memberExpression = t.memberExpression(
                    previewUIExpression,
                    t.identifier("LucideIcons")
                );
            } else if (source === "framer-motion") {
                memberExpression = t.memberExpression(
                    previewUIExpression,
                    t.identifier("FramerMotion")
                );
            } else if (source === "next/image") {
                memberExpression = t.memberExpression(
                    previewUIExpression,
                    t.identifier("Image")
                );
            } else if (source === "next/link") {
                memberExpression = t.memberExpression(
                    previewUIExpression,
                    t.identifier("Link")
                );
            } else if (
                source.startsWith("@/components/ui/") ||
                source === "@/lib/utils" ||
                source === "@radix-ui/react-slot"
            ) {
                // Для UI компонентів залишаємо window.PreviewUI,
                // оскільки вони експортуються напряму в корені об'єкта.
                memberExpression = previewUIExpression;
            } else {
                // Невідомі імпорти видаляємо, щоб код не впав
                path.remove();
                return;
            }

            const replacementDeclarators: any[] = [];
            const namedImports: any[] = [];

            path.node.specifiers.forEach((specifier: any) => {
                if (specifier.importKind === "type") return;

                // Ігноруємо { JSX } з React, це віртуальний тип
                if (isReact && specifier.local.name === "JSX") return;

                if (t.isImportSpecifier(specifier)) {
                    // import { Button } from ... -> const { Button } = ...
                    namedImports.push(
                        t.objectProperty(
                            t.identifier(specifier.imported.name), // Ключ (оригінальне ім'я)
                            t.identifier(specifier.local.name), // Значення (локальне ім'я)
                            false,
                            specifier.imported.name === specifier.local.name // Shorthand?
                        )
                    );
                } else if (t.isImportDefaultSpecifier(specifier)) {
                    // import React from 'react' -> const React = window.PreviewUI.React
                    replacementDeclarators.push(
                        t.variableDeclarator(
                            t.identifier(specifier.local.name),
                            memberExpression
                        )
                    );
                } else if (t.isImportNamespaceSpecifier(specifier)) {
                    // import * as React from 'react'
                    replacementDeclarators.push(
                        t.variableDeclarator(
                            t.identifier(specifier.local.name),
                            memberExpression
                        )
                    );
                }
            });

            // Якщо є іменовані імпорти, додаємо деструктуризацію
            if (namedImports.length > 0) {
                replacementDeclarators.push(
                    t.variableDeclarator(
                        t.objectPattern(namedImports),
                        memberExpression
                    )
                );
            }

            // Замінюємо import на const ...
            if (replacementDeclarators.length > 0) {
                path.replaceWithMultiple(
                    replacementDeclarators.map((decl: any) =>
                        t.variableDeclaration("const", [decl])
                    )
                );
            } else {
                path.remove();
            }
        },
    },
});

// 3. Плагін для обробки експортів (залишаємо як було, він працює коректно)
const HandleExportsPlugin = ({ types: t }: any) => ({
    visitor: {
        ExportDefaultDeclaration(path: any) {
            const decl = path.node.declaration;
            if (t.isFunctionDeclaration(decl) || t.isClassDeclaration(decl)) {
                if (decl.id) {
                    const assignment = t.expressionStatement(
                        t.assignmentExpression(
                            "=",
                            t.memberExpression(
                                t.identifier("window"),
                                t.identifier("DefaultExport")
                            ),
                            decl.id
                        )
                    );
                    path.replaceWithMultiple([decl, assignment]);
                } else {
                    const assignment = t.expressionStatement(
                        t.assignmentExpression(
                            "=",
                            t.memberExpression(
                                t.identifier("window"),
                                t.identifier("DefaultExport")
                            ),
                            decl
                        )
                    );
                    path.replaceWith(assignment);
                }
            } else {
                const assignment = t.expressionStatement(
                    t.assignmentExpression(
                        "=",
                        t.memberExpression(
                            t.identifier("window"),
                            t.identifier("DefaultExport")
                        ),
                        decl
                    )
                );
                path.replaceWith(assignment);
            }
        },
        ExportNamedDeclaration(path: any) {
            if (path.node.declaration) {
                const decl = path.node.declaration;
                path.replaceWith(decl);
                let id = null;
                if (t.isFunctionDeclaration(decl) || t.isClassDeclaration(decl))
                    id = decl.id;
                else if (
                    t.isVariableDeclaration(decl) &&
                    decl.declarations.length > 0
                )
                    id = decl.declarations[0].id;

                if (id) {
                    const assignment = t.expressionStatement(
                        t.assignmentExpression(
                            "=",
                            t.memberExpression(
                                t.identifier("window"),
                                t.identifier("LastExportedComponent")
                            ),
                            id
                        )
                    );
                    path.insertAfter(assignment);
                }
            } else {
                path.remove();
            }
        },
        ExportAllDeclaration(path: any) {
            path.remove();
        },
    },
});

export const compileCode = (code: string) => {
    try {
        const result = Babel.transform(code, {
            filename: "component.tsx",
            presets: [
                ["env", { modules: false, targets: { esmodules: true } }],
                ["react", { runtime: "classic" }],
                ["typescript", { isTSX: true, allExtensions: true }],
            ],
            plugins: [
                RemoveUseClientPlugin,
                // ВИПРАВЛЕННЯ: Додаємо (Babel as any), щоб TypeScript не скаржився на відсутність .types
                [
                    TransformImportsToRegistryPlugin,
                    { types: (Babel as any).types },
                ],
                [HandleExportsPlugin, { types: (Babel as any).types }],
            ],
        });
        return { code: result.code, error: null };
    } catch (error: any) {
        console.error("Compilation Error:", error);
        return { code: null, error: error.message };
    }
};

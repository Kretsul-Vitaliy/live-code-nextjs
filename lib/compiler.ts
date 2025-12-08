import * as Babel from "@babel/standalone";

// 1. Плагін для очищення коду від "use client"
const RemoveUseClientPlugin = () => ({
  visitor: {
    Program(path: any) {
      path.node.body = path.node.body.filter((node: any) => {
        if (node.type === "ExpressionStatement" && node.expression.type === "StringLiteral") {
          return node.expression.value !== "use client";
        }
        return true;
      });
      if (path.node.directives) {
        path.node.directives = path.node.directives.filter(
          (directive: any) => directive.value.value !== "use client"
        );
      }
    },
  },
});

// 2. Плагін для трансформації імпортів (ВИПРАВЛЕНО: отримуємо 'types' як 't' з аргументів)
const TransformImportsToRegistryPlugin = ({ types: t }: any) => ({
  visitor: {
    Program: {
      exit(path: any) {
        path.scope.crawl();
        // Якщо React не імпортовано, додаємо його глобально з window.PreviewUI
        if (!path.scope.hasBinding("React")) {
          const reactDeclaration = t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier("React"),
              t.memberExpression(
                t.memberExpression(t.identifier("window"), t.identifier("PreviewUI")),
                t.identifier("React")
              )
            ),
          ]);
          path.node.body.unshift(reactDeclaration);
        }
      },
    },
    ImportDeclaration(path: any) {
      // Видаляємо імпорти типів
      if (path.node.importKind === "type") {
        path.remove();
        return;
      }

      const source = path.node.source.value;
      const previewUIExpression = t.memberExpression(t.identifier("window"), t.identifier("PreviewUI"));
      let memberExpression: any = previewUIExpression;
      let isReact = false;

      // Логіка мапінгу бібліотек
      if (source === "react") isReact = true;
      else if (source === "lucide-react") memberExpression = t.memberExpression(previewUIExpression, t.identifier("LucideIcons"));
      else if (source === "framer-motion") memberExpression = t.memberExpression(previewUIExpression, t.identifier("FramerMotion"));
      else if (source === "next/image") memberExpression = t.memberExpression(previewUIExpression, t.identifier("Image"));
      else if (source === "next/link") memberExpression = t.memberExpression(previewUIExpression, t.identifier("Link"));
      // Дозволяємо локальні імпорти UI компонентів проходити через реєстр
      else if (source.startsWith("@/components/ui/") || source === "@/lib/utils" || source === "@radix-ui/react-slot") memberExpression = previewUIExpression;
      else { 
        // Видаляємо невідомі імпорти, щоб не ламати виконання
        path.remove(); 
        return; 
      }

      const replacementDeclarators: any[] = [];
      const namedImports: any[] = [];

      path.node.specifiers.forEach((specifier: any) => {
        if (specifier.importKind === "type") return;
        if (isReact && specifier.local.name === "JSX") return;

        if (t.isImportSpecifier(specifier)) {
          // import { Button } from ...
          namedImports.push(
            t.objectProperty(
              t.identifier(specifier.imported.name),
              t.identifier(specifier.local.name),
              false,
              specifier.imported.name === specifier.local.name
            )
          );
        } else if (t.isImportDefaultSpecifier(specifier)) {
          // import React from ...
          replacementDeclarators.push(t.variableDeclarator(t.identifier(specifier.local.name), memberExpression));
        } else if (t.isImportNamespaceSpecifier(specifier)) {
          // import * as React from ...
          replacementDeclarators.push(t.variableDeclarator(t.identifier(specifier.local.name), memberExpression));
        }
      });

      if (namedImports.length > 0) {
        replacementDeclarators.push(t.variableDeclarator(t.objectPattern(namedImports), memberExpression));
      }

      if (replacementDeclarators.length > 0) {
        path.replaceWithMultiple(replacementDeclarators.map((decl: any) => t.variableDeclaration("const", [decl])));
      } else {
        path.remove();
      }
    },
  },
});

// 3. Плагін для обробки експортів (ВИПРАВЛЕНО: отримуємо 'types' як 't')
const HandleExportsPlugin = ({ types: t }: any) => ({
  visitor: {
    ExportDefaultDeclaration(path: any) {
      const decl = path.node.declaration;
      if (t.isFunctionDeclaration(decl) || t.isClassDeclaration(decl)) {
        if (decl.id) {
          const assignment = t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(t.identifier("window"), t.identifier("DefaultExport")),
              decl.id
            )
          );
          path.replaceWithMultiple([decl, assignment]);
        } else {
          const assignment = t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(t.identifier("window"), t.identifier("DefaultExport")),
              decl
            )
          );
          path.replaceWith(assignment);
        }
      } else {
        const assignment = t.expressionStatement(
          t.assignmentExpression(
            "=",
            t.memberExpression(t.identifier("window"), t.identifier("DefaultExport")),
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
        if (t.isFunctionDeclaration(decl) || t.isClassDeclaration(decl)) id = decl.id;
        else if (t.isVariableDeclaration(decl) && decl.declarations.length > 0) id = decl.declarations[0].id;
        
        if (id) {
          const assignment = t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(t.identifier("window"), t.identifier("LastExportedComponent")),
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
        TransformImportsToRegistryPlugin, // Тепер цей плагін коректно ініціалізується з types
        HandleExportsPlugin,
      ],
    });
    return { code: result.code, error: null };
  } catch (error: any) {
    console.error("Compilation Error:", error);
    return { code: null, error: error.message };
  }
};

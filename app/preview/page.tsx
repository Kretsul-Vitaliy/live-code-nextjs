// Це сторінка всередині iframe
"use client";
import React, { useEffect, useState } from 'react';
import * as Babel from '@babel/standalone';

export default function PreviewPage() {
  const [Component, setComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // ПЕРЕВІРКА ORIGIN ОБОВ'ЯЗКОВА ДЛЯ БЕЗПЕКИ
      if (event.origin !== window.location.origin) return;

      try {
        const rawCode = event.data.code;
        // Транспіляція JSX -> JS прямо в браузері
        const compiled = Babel.transform(rawCode, {
          presets: ['react', 'env']
        }).code;

        // Створення виконуваної функції
        // Увага: `new Function` вимагає наявності React в scope
        const func = new Function('React', `return ${compiled}`)(React);
        setComponent(() => func);
      } catch (err) {
        console.error("Compilation error", err);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!Component) return <div>Waiting for code...</div>;
  return <Component />;
}
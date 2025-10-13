// eslint.config.js
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  // Configuração principal para arquivos JavaScript e JSX
  {
    files: ["**/*.{js,jsx,mjs,cjs,css}"], // Aplica a todos os arquivos JS/JSX em qualquer pasta
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Habilita o suporte para sintaxe JSX
        },
      },
      globals: {
        ...globals.browser, // Adiciona variáveis globais de ambiente de navegador (window, document, etc)
      },
    },
    rules: {
      // Pega as regras recomendadas do ESLint e dos plugins
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      
      // Regras essenciais para Vite e React moderno
      "react-refresh/only-export-components": "warn", // Garante que apenas componentes sejam exportados para o Fast Refresh
      "react/react-in-jsx-scope": "off", // Desativa a regra que exigia "import React from 'react'" em todo arquivo
      
      // Personalizações (opcional, adicione as suas aqui)
      "react/prop-types": "off", // Desativa a verificação de prop-types se você usa TypeScript ou prefere não usar
      "no-unused-vars": "warn", // Apenas avisa sobre variáveis não utilizadas em vez de dar erro
    },
    settings: {
        react: {
            version: "detect" // Detecta automaticamente a versão do React instalada
        }
    }
  },

  // Configuração para arquivos de configuração (opcional, mas boa prática)
  {
    files: ["eslint.config.js", "vite.config.js"],
    languageOptions: {
      globals: {
        ...globals.node, // Permite variáveis globais de ambiente Node.js (como 'module', 'require')
      },
    },
  },
];
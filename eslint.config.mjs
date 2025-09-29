import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jest from "eslint-plugin-jest"; // 1. Importe o plugin do Jest

export default defineConfig([
  // Sua configuração global que já existia
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node }
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" }
  },

  // 2. Adicione este bloco para a configuração do Jest
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js"], // Aplica somente a arquivos dentro de __tests__ ou que terminam com .test.js
    ...jest.configs['flat/recommended'], // Usa a configuração recomendada do Jest
    rules: {
      ...jest.configs['flat/recommended'].rules,
      // Se quiser sobrescrever alguma regra, pode fazer aqui
      // Ex: "jest/no-disabled-tests": "warn",
    }
  }
]);
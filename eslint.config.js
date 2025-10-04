/**
 * The `@eslint/eslintrc` package is necessary for:
 *
 * 1. Packages that haven't yet updated to the new flat config format
 * 2. Packages that don't ship type definitions or the one that ships is incorrect
 *    and not compatible with the flat config type definitions
 */

import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import love from "eslint-config-love";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";
import tseslint from "typescript-eslint";

const OFF = 0;
const WARN = 1;
const ERROR = 2;

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  resolvePluginsRelativeTo: import.meta.dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...compat.extends("plugin:@eslint-community/eslint-comments/recommended"),
  love,
  {
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      formComponents: ["Form"],
      linkComponents: [
        {
          name: "BaseLink",
          linkAttribute: "to",
        },
        {
          name: "Link",
          linkAttribute: "to",
        },
        {
          name: "NavLink",
          linkAttribute: "to",
        },
      ],
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react/jsx-no-leaked-render": [
        ERROR,
        {
          validStrategies: ["ternary"],
        },
      ],
    },
  },
  {
    ...reactHooks.configs["recommended-latest"],
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
      "react-hooks/react-compiler": ERROR,
    },
  },
  {
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.strict.rules,
      "jsx-a11y/anchor-has-content": [
        ERROR,
        {
          components: ["BaseLink", "Link", "NavLink"],
        },
      ],
    },
  },
  sonarjs.configs.recommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": ERROR,
      "simple-import-sort/exports": ERROR,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@eslint-community/eslint-comments/require-description": [
        ERROR,
        {
          ignore: ["eslint-enable"],
        },
      ],
      "@typescript-eslint/consistent-type-definitions": [ERROR, "type"],
      "@typescript-eslint/consistent-type-imports": [
        ERROR,
        {
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": OFF,
      "@typescript-eslint/no-deprecated": ERROR,
      "@typescript-eslint/no-magic-numbers": [
        ERROR,
        {
          ignoreTypeIndexes: true,
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        ERROR,
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/no-namespace": [
        ERROR,
        {
          allowDeclarations: true,
        },
      ],
      "@typescript-eslint/only-throw-error": [
        ERROR,
        {
          allow: [
            {
              from: "lib",
              name: "Response",
            },
          ],
        },
      ],
      "@typescript-eslint/prefer-destructuring": [
        ERROR,
        {
          array: false,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      "@typescript-eslint/return-await": [ERROR, "in-try-catch"],
      "arrow-body-style": OFF,
      "import/first": ERROR,
      "import/newline-after-import": ERROR,
      "import/no-duplicates": ERROR,
      "no-restricted-imports": [
        ERROR,
        {
          name: "zod",
          message: 'Please use "zod/mini" instead.',
        },
        {
          name: "zod/v4",
          message: 'Please use "zod/mini" instead.',
        },
      ],
      "sonarjs/no-commented-code": WARN,
      "sonarjs/todo-tag": WARN,
    },
  },
  {
    files: ["app/**/*.test.ts?(x)"],
    ...testingLibrary.configs["flat/react"],
  },
  {
    files: ["app/**/*.test.ts?(x)"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules,
      "vitest/no-hooks": OFF,
      "vitest/prefer-expect-assertions": OFF,
    },
  },
  {
    files: ["app/**/*.test.ts?(x)"],
    rules: {
      "@typescript-eslint/no-magic-numbers": OFF,
    },
  },
  {
    ignores: [
      ".react-router/",
      ".wrangler/",
      "build/",
      "coverage/",
      "worker-configuration.d.ts",
    ],
  },
);

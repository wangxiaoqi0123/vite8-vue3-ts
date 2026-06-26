import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import autoImport from './.eslintrc-auto-import.js';

export default [
  // 1. 全局忽略配置（必须放在最前面！！！）
  {
    ignores: [
      'public/**',
      'dist/**',
      '*.d.ts',
      'package.json',
      'tsconfig.json',
      '*.md',
      'node_modules/',
      'index.html',
      'src/assets/iconfont/**',
      '.eslintrc-auto-import.js',
      '**/.env',
      '**/.env.*',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
    ],
  },

  // 2. 全局语言选项（基础配置）
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // 添加 Node globals（用于 vite.config.ts 等）
        ...(autoImport.globals || {}),
      },
    },
  },

  // 3. JavaScript 推荐规则
  pluginJs.configs.recommended,
  // 4. TypeScript 推荐规则
  ...tseslint.configs.recommended,
  // 5. Vue 3 核心规则
  ...pluginVue.configs['flat/essential'],
  // 6. Prettier 集成（关闭冲突规则 + 启用插件）
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  // 7. Vue + TypeScript 专用规则（覆盖）
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // 关闭/调整 Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/attribute-hyphenation': [
        'error',
        'always',  // 或 'never'，这里用 always 强制短横线
        {
          ignore: [],  // 可以忽略某些属性
        },
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',  // 强制 PascalCase
        {
          registeredComponentsOnly: true, 
          ignores: ['index','Index'],      
        },
      ],
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        },
      ],
    },
  },
  // 8. TypeScript 规则覆盖（仅对 TS 和 Vue 文件生效）
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      // 关闭/调整 TypeScript 规则
      'no-debugger': 'off',
      'no-unused-vars': 'off', // 由 @typescript-eslint/no-unused-vars 替代
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import autoImport from './.eslintrc-auto-import.js'

export default [
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
      '.eslintrc-auto-import.*',
      '**/.env',
      '**/.env.*',
      '**/pnpm-lock.yaml',
      '**/package-lock.json'
    ]
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...(autoImport.globals || {})
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  prettier,
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/attribute-hyphenation': [
        'error',
        'always',
        {
          ignore: [] // 可以忽略某些属性
        }
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase', // 强制 PascalCase
        {
          registeredComponentsOnly: false,
          ignores: ['index', 'Index']
        }
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
            'CONTENT'
          ],
          alphabetical: false
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      // 关闭/调整 TypeScript 规则
      'no-debugger': 'off',
      'no-unused-vars': 'off', // 由 @typescript-eslint/no-unused-vars 替代
      'no-useless-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  }
]

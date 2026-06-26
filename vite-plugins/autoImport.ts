import AutoImport from 'unplugin-auto-import/vite'

export default function autoImport() {
  return AutoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    dts: './src/types/auto-imports.d.ts',
    eslintrc: { enabled: true, filepath: './.eslintrc-auto-import.js' }
  })
}

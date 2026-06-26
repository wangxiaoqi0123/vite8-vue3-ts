import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  variants: [
    matcher => {
      if (!matcher.startsWith('empty-after:')) return matcher
      return {
        matcher: matcher.slice('empty-after:'.length),
        selector: s => `${s}:empty::after`
      }
    },
    matcher => {
      if (matcher.startsWith('before:')) {
        return {
          matcher: matcher.slice('before:'.length),
          selector: s => `${s}::before`
        }
      }
      return matcher
    }
  ],
  rules: [
    [
      /^b-content(?:-(.+))?$/,
      ([, content]) => ({
        content: `"${content || ''}"`
      })
    ],
    [/^align-\[(.+)\]$/, ([, val]) => ({ 'vertical-align': val })],
    [/^mlr-(\d+)$/, match => ({ 'margin-left': `${match[1]}`, 'margin-right': `${match[1]}` })]
  ],
  shortcuts: {
    'b-opt':
      'flex items-center text-[12px] font-400 text-[#378eef] cursor-pointer whitespace-nowrap hover:text-[#5fa4f2] active:text-[#2c71bf] focus:text-[#378eef]',
    'b-text-empty': 'empty-after:b-content---',
    'b-title-tag':
      'before:b-content before:h-[12px] before:w-[2px] before:bg-[#378eef] before:inline-block before:mr-[8px] before:align-[-2px]',
    'b-required':
      'before:b-content-* before:inline-block before:me-4px before:text-[12px] before:text-[#f04141] before:leading-[1] font-[SimSun,sans-serif] not-italic',
    'fs-box-shadow': 'p-24px rounded-[4px] bg-white shadow-[0_2px_8px_0_rgba(88,98,110,0.12)]',
    'b-ellipsis': 'overflow-hidden whitespace-nowrap text-ellipsis'
  }
})

/**
 * @name SvgIconsPlugin
 * @description 加载SVG文件，自动引入
 */
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export const svgIcons = () => {
  return createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(__dirname, '../src/assets/icons')],
    // 指定symbolId格式
    symbolId: 'icon-[name]'
  })
}

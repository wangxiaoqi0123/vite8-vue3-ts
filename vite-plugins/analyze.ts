import { visualizer } from 'rollup-plugin-visualizer'
export default function analyze() {
  return process.env.analyze && visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'report.html' })
}

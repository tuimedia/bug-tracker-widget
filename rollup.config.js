import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/bug-tracker-widget.js',
  output: {
    file: 'dist/bug-tracker-widget.js',
    format: 'esm',
  },
  plugins: [resolve(), terser()],
}

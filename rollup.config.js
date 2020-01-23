import resolve from 'rollup-plugin-node-resolve';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import { terser } from "rollup-plugin-terser";

const outFolder = 'dist';

function onwarn(warning) {
  if (warning.code === 'THIS_IS_UNDEFINED')
    return;
  console.error(warning.message);
}

export default [
  {
    input: 'bin/main-app.js',
    output: {
      file: `${outFolder}/app.js`,
      format: 'iife',
      name: 'CSI'
    },
    onwarn,
    plugins: [resolve(), minifyHTML(), terser({
      output: {
        comments: false
      }
    })]
  }
];
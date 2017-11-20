import * as path  from "path"
import babel      from "rollup-plugin-babel"
import uglify     from "rollup-plugin-uglify"
import commonjs   from "rollup-plugin-commonjs"
import resolve    from "rollup-plugin-node-resolve"
import json       from "rollup-plugin-json"
import { minify } from "uglify-es"

const config = {
  input: path.join(__dirname, 'src/index.js'),
  output: {
    file: path.join(__dirname, 'dist/redux-jwt.min.js'),
    format: 'es'
  },
  name: 'Redux-JWT',
  globals: {
    react: 'React'
  },
  external: [
    'react',
    'react-dom',
    'react-redux',
    'redux'
  ],
  plugins: [
    json({
      exclude: ['node_modules/**']
    }),
    babel({
      exclude: ['node_modules/**'],
      babelrc: false,
      presets: [
        'es2015-rollup',
        'react'
      ]
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      include: /node_modules/
    }),
    uglify({}, minify)
  ],
}

export default config

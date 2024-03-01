import {nodeResolve} from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import progress from 'rollup-plugin-progress'
import * as path from "path";
import { fileURLToPath } from 'url';
import postcss from 'rollup-plugin-postcss'
import autoprefixer from "autoprefixer"
import pkg from './package.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const production = !(process.env.ROLLUP_WATCH),
    sourcemap = !production,
    cache = false

const banner = `
/*!
 * Minataur v${pkg.version}
 * Copyright ${new Date().getFullYear()} Serhii Pimenov
 * Licensed under MIT
 *
 * Build time: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
 */
`


export default [
    {
        input: './vendor/metro4.js',
        cache,
        watch: {
            clearScreen: false
        },
        plugins: [
            progress({ clearLine: true, }),
            nodeResolve({ browser: true, }),
            postcss({
                extract: false,
                minimize: true,
                use: ['less'],
                sourceMap: false,
                plugins: [
                    autoprefixer(),
                ]
            }),
        ],
        output: [
            {
                file: './server/Views/vendor/metro/metro4.js',
                format: 'iife',
                sourcemap,
                banner,
                plugins: [
                    terser({
                        keep_classnames: true,
                        keep_fnames: true,
                    })
                ]
            },
        ]
    },
]
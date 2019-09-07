import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

export default {
	input: './src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs'
		},
		{
			file: pkg.module,
			format: 'esm'
		}
	],
	plugins: [
		resolve({ preferBuiltins: true }),
		typescript({
			tsconfigOverride: {
				include: ['src']
			}
		})
	]
};

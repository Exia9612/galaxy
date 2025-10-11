import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

module.exports = {
	input: "src/index.ts",
	output: [
		{
			format: "esm",
			file: "dist/esm/index.js",
		},
		{
			format: "cjs",
			file: "dist/cjs/index.js",
		},
		{
			format: "umd",
			file: "dist/umd/index.js",
			name: "galaxyObserver",
		},
		{
			format: "iife",
			file: "dist/bundle/index.js",
			name: "galaxyObserver",
			plugins: [terser()],
		},
	],
	plugins: [
		resolve(),
		commonjs(),
		typescript({
			declaration: true,
			rootDir: "./src",
		}),
		babel({ babelHelpers: "bundled" }),
	],
};

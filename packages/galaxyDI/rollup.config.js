import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
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
			name: "galaxyDI",
		},
		{
			format: "iife",
			file: "dist/bundle/index.js",
			name: "galaxyDI",
			plugins: [terser()],
		},
	],
	plugins: [
		resolve(), // 查找和打包node_modules中的第三方模块
		commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理，rollup处理配置文件时需要
		typescript({
			declaration: true, // 生成 .d.ts 文件
			rootDir: "./src",
		}),
		babel({ babelHelpers: "bundled" }), // babel配置,编译es6
	],
};

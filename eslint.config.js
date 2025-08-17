const {defineConfig, globalIgnores} = require("eslint/config");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const typescriptParser = require("@typescript-eslint/parser");
const babelParser = require("@babel/eslint-parser");

// eslint9 document https://eslint.org/docs/latest/use/configure/configuration-files

module.exports = defineConfig([
	{
		name: "root",
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		languageOptions: {
			ecmaVersion: 2020,
			// 追加浏览器全局变量，例如window
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	globalIgnores([
		"dist",
		"errorJson.js",
		"browser.js",
		"node_modules",
		"test",
		".gitignore",
		".prettierignore",
		"scripts/*",
		"rollup.config.mjs",
	]),
	{
		name: "js",
		files: ["**/*.js", "**/*.jsx"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-useless-escape": "off",
			"no-unused-vars": "off",
		},
	},
	{
		name: "js-parser",
		files: ["**/*.js", "**/*.mjs"],
		languageOptions: {
			parser: babelParser,
		},
	},
	{
		name: "typescript",
		files: ["**/*.ts", "**/*.tsx"],
		plugins: {
			tseslint,
		},
		extends: ["tseslint/recommended"],
		rules: {
			"@typescript-eslint/interface-name-prefix": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-unused-vars": "warn",
		},
		languageOptions: {
			parser: typescriptParser,
		},
	},
	eslintPluginPrettierRecommended,
]);

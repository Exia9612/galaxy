const webpack = require("webpack");

const minify = process.env.DIST_MIN;
const mode = process.env.MODE || "development";
const plugins = !minify
	? []
	: [
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					drop_console: false,
				},
			}),
		];
const filename = !minify ? "frint-model.js" : "frint-model.min.js";

module.exports = {
	mode: mode,
	entry: __dirname + "/src/index.ts",
	resolve: {
		extensions: [".ts", ".js"],
	},
	output: {
		path: __dirname + "/dist",
		filename: filename,
	},
	target: "web",
	plugins: [...plugins],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: "babel-loader",
			},
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
};

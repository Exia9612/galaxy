const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: process.env.NODE_ENV || "development",
	entry: "./index.ts",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Sentinel test",
			template: "./index.html",
		}),
	],
};

// 从 Stylelint v15 开始， Stylelint 弃用了所有与 prettier 冲突的风格规则，并在 Stylelint v16 中删除了这些规则，引入 Stylelint 完全不与 Prettier 冲突了

module.exports = {
	extends: ["stylelint-config-standard-scss"],
	ignoreFiles: ["**/node_modules/**/*", "**/build/**/*", "**/dist/**/*"],
	rules: {
		"color-no-hex": true,
		// 禁用无效的双斜杠注释规则
		"no-invalid-double-slash-comments": null,
		// 指定规则前需要空行
		"rule-empty-line-before": "always",
		"custom-property-pattern": [
			"^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
			{
				"message": "Expected custom property name to be kebab-case",
			},
		],
	},
};

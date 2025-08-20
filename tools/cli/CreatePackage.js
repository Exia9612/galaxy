const prompts = require("prompts");
const fs = require("fs");
const path = require("path");
const {execSync} = require("child_process");
const chalk = require("chalk");

const questions = [
	{
		type: "select",
		name: "directory",
		message:
			"Please select the directory you want to create you want to create your package",
		choices: [
			{title: "apps", value: "apps"},
			{title: "packages", value: "packages"},
			{title: "tools", value: "tools"},
		],
		hint: "- Space to select. Return to submit",
		validate: (value) => {
			if (!value) {
				return "Please select a directory";
			}
			return true;
		},
	},
	{
		type: "text",
		name: "packageName",
		message: "Please enter the package name",
		validate: (value) => {
			if (!value) {
				return "Please input the package name";
			}
			return true;
		},
	},
];

(async () => {
	try {
		const {directory, packageName} = await prompts(questions);

		if (!directory || !packageName) {
			console.log(
				chalk.red("Please input the package name and select a directory"),
			);
			return;
		}

		const rootPath = path.resolve(__dirname, "../../");
		const newPackagePath = path.resolve(rootPath, directory, packageName);
		console.log(newPackagePath);

		if (fs.existsSync(newPackagePath)) {
			console.log(
				chalk.yellow(
					`The package ${packageName} already exists in ${directory}`,
				),
			);
		} else {
			fs.mkdirSync(newPackagePath);
		}

		process.chdir(newPackagePath);
		console.log(chalk.green(`Creating package ${packageName} in ${directory}`));

		try {
			execSync("pnpm init");
			console.log(
				chalk.green(`Package ${packageName} initialized successfully`),
			);
		} catch (error) {
			console.log(chalk.red(`Failed to initialize package ${packageName}`));
			return;
		}
	} catch (error) {
		console.log(
			chalk.red(`Encounter error when creating package: ${error.message}`),
		);
	}
})();

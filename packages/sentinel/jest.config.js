process.env.TZ = "UTC";

module.exports = {
	coverageDirectory: "./coverage/",
	// coverageThreshold: {
	// 	global: {
	// 		statements: 100,
	// 		branches: 100,
	// 		functions: 100,
	// 		lines: 100,
	// 	},
	// },
	collectCoverageFrom: ["core/store/**/*.ts"],
	coverageReporters: ["lcov", ["text", { skipFull: true }], "text-summary"],
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
		},
	},
	// moduleNameMapper: {
	//   '^~app/(.*)$': '<rootDir>/src/$1',
	// },
	moduleFileExtensions: ["js", "ts"],
	// setupFilesAfterEnv: ['./internal/setupJest.ts'],
	transform: {
		"^.+\\.(ts)$": ["@swc/jest"],
	},
	testMatch: ["**/__test__/?(*.)+(test).ts"],
	testEnvironment: "node",
	preset: "ts-jest",
	clearMocks: true,
};

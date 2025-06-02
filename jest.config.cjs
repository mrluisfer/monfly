// jest.config.cjs
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
	moduleNameMapper: {
		"^~/(.*)$": "<rootDir>/src/$1",
		"^@/(.*)$": "<rootDir>/src/$1",
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	transform: {
		"^.+\\.(ts|tsx|js|jsx|mjs)$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.json",
				useESM: true,
			},
		],
	},
	testMatch: [
		"**/__tests__/**/*.+(ts|tsx|js)",
		"**/?(*.)+(spec|test).+(ts|tsx|js)",
	],
	moduleFileExtensions: [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node",
		"mjs",
		"cjs",
		"d.cts",
		"d.mts",
		"d.cts",
		"d.mts",
		".ts",
		".tsx",
		".mjs",
		".js",
	],
	testPathIgnorePatterns: ["/node_modules/", "/.next/"],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/types/**/*",
	],
};

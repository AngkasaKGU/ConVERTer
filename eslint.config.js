import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs["flat/recommended"],
	prettier,
	...svelte.configs["flat/prettier"],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],

		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	{
		ignores: ["build/", ".svelte-kit/", "dist/", "src/lib/paraglide/"],
	},
	{
		files: ["**/*.ts", "**/*.svelte.ts", "**/*.svelte"],
		rules: {
			"svelte/no-at-html-tags": "off",
			"svelte/valid-compile": "off",
		},
	},
	{
		// ConVERTer: rules new in ESLint 10's recommended set that upstream code doesn't pass yet.
		// warn instead of fixing upstream files, to keep upstream merges clean
		rules: {
			"no-useless-assignment": "warn",
			"preserve-caught-error": "warn",
		},
	},
);

import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
	PUB_HOSTNAME: {
		public: true,
		static: true,
		description:
			"The hostname used for analytics tracking (currently only used by Plausible).",
	},
	PUB_PLAUSIBLE_URL: {
		public: true,
		static: true,
		description:
			"URL for your Plausible Analytics instance (leave empty to disable analytics).",
	},
	PUB_ENV: {
		public: true,
		static: true,
		description:
			'Application environment: "production", "development", or "nightly".',
	},
	PUB_VERTD_URL: {
		public: true,
		static: true,
		description:
			"Unused in ConVERTer: local conversion only, vertd is never contacted (see docs/adr/0001). Kept so upstream vertd code still compiles.",
		// optional in ConVERTer, so builds don't need it set
		schema: (value) => value ?? "",
	},
	PUB_DISABLE_ALL_EXTERNAL_REQUESTS: {
		public: true,
		static: true,
		description:
			"Set to true to disable all external requests (vertd, Stripe, Plausible, etc.).",
	},
	PUB_DISABLE_FAILURE_BLOCKS: {
		public: true,
		static: true,
		description:
			"Set to true to disable blocking video conversions of a file after repeated failures.",
	},
	PUB_DONATION_URL: {
		public: true,
		static: true,
		description:
			"Stripe donation settings. Please keep these values the same, they support VERT's development!",
	},
	PUB_STRIPE_KEY: {
		public: true,
		static: true,
		description:
			"Stripe donation settings. Please keep these values the same, they support VERT's development!",
	},
});

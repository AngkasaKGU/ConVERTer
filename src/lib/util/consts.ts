import { PUB_DISABLE_ALL_EXTERNAL_REQUESTS, PUB_ENV } from "$app/env/public";

// upstream VERT, still credited and used for the contributor list
export const GITHUB_URL_VERT = "https://github.com/VERT-sh/VERT";
// ConVERTer's own fork repo: target of "source code" and commit links
export const GITHUB_URL_FORK = "https://github.com/AngkasaKGU/ConVERTer";
export const GITHUB_URL_VERTD = "https://github.com/VERT-sh/vertd";
export const GITHUB_API_URL = "https://api.github.com/repos/VERT-sh/VERT";
export const DISCORD_URL = "https://discord.gg/kqevGxYPak";
export const VERT_NAME =
	{
		development: "ConVERTer Local",
		nightly: "ConVERTer Nightly",
	}[PUB_ENV as string] ?? "ConVERTer";
export const CONTACT_EMAIL = "hello@vert.sh";

// ConVERTer only does local conversion: never use the vertd video conversion server.
// deliberately hard-coded (not an env var) so no deployment can re-enable uploads. see docs/adr/0001
export const LOCAL_ONLY = true;

// i'm not entirely sure this should be in consts.ts, but it is technically a constant as .env is static for VERT
export const DISABLE_ALL_EXTERNAL_REQUESTS =
	PUB_DISABLE_ALL_EXTERNAL_REQUESTS === "true";

// whether the vertd video conversion server may be used at all (never, in ConVERTer)
export const VERTD_ENABLED = !DISABLE_ALL_EXTERNAL_REQUESTS && !LOCAL_ONLY;

export const GB = 1024 * 1024 * 1024;

export function conversionConcurrency(): number {
	const cores =
		typeof navigator !== "undefined"
			? navigator.hardwareConcurrency || 4
			: 4;
	return Math.max(1, cores - 1); // leave one core free just cause
}

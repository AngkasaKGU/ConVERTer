// Fails when upstream VERT branding leaks into ConVERTer, typically after merging upstream (main).
// 1. messages/*.json: a message says "VERT" (other than "ConVERTer") outside the keys that are
//    about upstream itself or belong to features ConVERTer keeps but never renders.
// 2. src/ and static/: "vert.sh" appears outside upstream-only code ConVERTer keeps but never uses.
// When a hit is legitimate, extend the allowlist below; otherwise rename it to ConVERTer.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

// message keys (prefix match) where "VERT" refers to upstream, or that ConVERTer never renders
const ALLOWED_MESSAGE_KEYS = [
	"about.credits.notable_description", // credits upstream's contributors
	"about.credits.contact_team", // removed from Credits
	"about.why.", // Why VERT? section removed
	"about.donate.", // Donate section removed
	"privacy.", // /privacy page removed
	"settings.vertd.", // video conversion server settings hidden (LOCAL_ONLY)
];

// files/dirs (prefix match, relative to repo root) allowed to mention vert.sh
const ALLOWED_VERT_SH_PATHS = [
	"src/lib/converters/vertd/", // disabled by LOCAL_ONLY
	"src/lib/sections/settings/vertdSettings.svelte.ts", // disabled by LOCAL_ONLY
	"src/lib/sections/about/Donate.svelte", // not rendered
	"src/lib/sections/about/Sponsors.svelte", // not rendered
	"src/lib/util/consts.ts", // CONTACT_EMAIL, no longer rendered
	"src/lib/paraglide/", // generated from messages/
];

const problems = [];

function* walkMessages(obj, prefix = "") {
	for (const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${key}` : key;
		if (value && typeof value === "object")
			yield* walkMessages(value, path);
		else if (typeof value === "string") yield [path, value];
	}
}

const messagesDir = join(ROOT, "messages");
for (const file of readdirSync(messagesDir).filter((f) =>
	f.endsWith(".json"),
)) {
	const messages = JSON.parse(readFileSync(join(messagesDir, file), "utf8"));
	for (const [key, value] of walkMessages(messages)) {
		if (ALLOWED_MESSAGE_KEYS.some((allowed) => key.startsWith(allowed)))
			continue;
		if (value.replaceAll("ConVERTer", "").includes("VERT"))
			problems.push(`messages/${file}: ${key} mentions VERT`);
	}
}

function* walkFiles(dir) {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) yield* walkFiles(full);
		else yield full;
	}
}

const TEXT_FILE = /\.(svelte|ts|js|mjs|html|json|xml|txt|css|scss)$/;
for (const dir of ["src", "static"]) {
	for (const full of walkFiles(join(ROOT, dir))) {
		const rel = relative(ROOT, full);
		if (!TEXT_FILE.test(rel)) continue;
		if (ALLOWED_VERT_SH_PATHS.some((allowed) => rel.startsWith(allowed)))
			continue;
		readFileSync(full, "utf8")
			.split("\n")
			.forEach((line, i) => {
				if (line.includes("vert.sh"))
					problems.push(`${rel}:${i + 1}: mentions vert.sh`);
			});
	}
}

if (problems.length) {
	console.error(
		`Upstream VERT branding found (${problems.length}). Rename to ConVERTer, or allowlist it in scripts/check-branding.mjs:\n`,
	);
	for (const problem of problems) console.error(`  ${problem}`);
	process.exit(1);
}
console.log("check-branding: no upstream VERT branding found");

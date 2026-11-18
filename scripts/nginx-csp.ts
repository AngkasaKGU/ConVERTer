// Writes nginx/default.conf to the given path, adding ConVERTer's Content-Security-Policy header when
// PUB_DISABLE_ALL_EXTERNAL_REQUESTS=true (docs/adr/0002). When it is false, the config is copied
// unchanged, so an operator who opts in to external requests doesn't have to edit nginx config too.
// Run by the Dockerfile: bun scripts/nginx-csp.ts <output path>
import { readFileSync, writeFileSync } from "node:fs";
import { CONTENT_SECURITY_POLICY } from "../src/lib/util/csp";

const out = process.argv[2];
if (!out) throw new Error("usage: bun scripts/nginx-csp.ts <output path>");

const conf = readFileSync(
	new URL("../nginx/default.conf", import.meta.url),
	"utf8",
);
const anchor = /^(\s*)add_header Permissions-Policy .*$/m;
if (!anchor.test(conf))
	throw new Error("nginx/default.conf: Permissions-Policy header not found");

const enabled = process.env.PUB_DISABLE_ALL_EXTERNAL_REQUESTS === "true";
writeFileSync(
	out,
	enabled
		? conf.replace(
				anchor,
				(line, indent) =>
					`${line}\n${indent}add_header Content-Security-Policy "${CONTENT_SECURITY_POLICY}" always;`,
			)
		: conf,
);
console.log(
	`${out}: Content-Security-Policy ${enabled ? "added" : "not added (external requests enabled)"}`,
);

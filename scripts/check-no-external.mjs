// Fails when a build made with PUB_DISABLE_ALL_EXTERNAL_REQUESTS=true would make an external request
// (a request to any host other than the deployment serving it, see GLOSSARY.md and docs/adr/0002).
// 1. build/**/*.html: an element that loads a resource (script, img, link, ...) points at another host.
// 2. build/**/*.html: the Content-Security-Policy <meta> tag is missing.
// 3. build/**/*.html and *.css: a CSS url(...) (stylesheet, <style> or style="") points at another host.
// Runtime fetch() calls are not caught here; the CSP blocks those in the browser.
// Usage: node scripts/check-no-external.mjs [build dir]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const BUILD = process.argv[2] ?? "build";

// absolute (http:, https:) or protocol-relative (//host) URLs
const EXTERNAL = /^(?:https?:)?\/\//i;

// elements that fetch the URL in these attributes when the page loads (<a href> only navigates)
const RESOURCE_TAG =
	/<(script|img|link|iframe|source|video|audio|track|embed|object|input)\b([^>]*)>/gi;
const RESOURCE_ATTR =
	/\s(src|href|srcset|data|poster)\s*=\s*["']([^"']*)["']/gi;
const CSS_URL = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
const CSP_META = /<meta\s+http-equiv=["']Content-Security-Policy["']/i;

function* walk(dir) {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) yield* walk(path);
		else yield path;
	}
}

const problems = [];
let pages = 0;

const checkCss = (rel, text) => {
	for (const [, url] of text.matchAll(CSS_URL))
		if (EXTERNAL.test(url)) problems.push(`${rel}: url(${url})`);
};

for (const file of walk(BUILD)) {
	const rel = relative(BUILD, file);
	if (file.endsWith(".html")) {
		pages++;
		const html = readFileSync(file, "utf8");
		for (const [, tag, attrs] of html.matchAll(RESOURCE_TAG)) {
			for (const [, attr, value] of attrs.matchAll(RESOURCE_ATTR)) {
				// srcset holds several comma-separated "url descriptor" pairs
				const urls =
					attr.toLowerCase() === "srcset"
						? value.split(",").map((s) => s.trim().split(/\s+/)[0])
						: [value];
				for (const url of urls)
					if (EXTERNAL.test(url))
						problems.push(`${rel}: <${tag} ${attr}="${url}">`);
			}
		}
		checkCss(rel, html); // inline <style> blocks and style="" attributes
		if (!CSP_META.test(html))
			problems.push(`${rel}: missing Content-Security-Policy <meta> tag`);
	} else if (file.endsWith(".css")) {
		checkCss(rel, readFileSync(file, "utf8"));
	}
}

// an empty or misplaced build dir must not pass silently
if (pages === 0) problems.push(`no .html pages found in ${BUILD}/`);

if (problems.length > 0) {
	console.error(`External requests found in ${BUILD}/ (see docs/adr/0002):`);
	for (const p of problems) console.error(`  ${p}`);
	process.exit(1);
}
console.log(`No external requests found in ${pages} pages in ${BUILD}/`);

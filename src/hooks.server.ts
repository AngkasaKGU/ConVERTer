import { paraglideMiddleware } from "#lib/paraglide/server";
import { DISABLE_ALL_EXTERNAL_REQUESTS } from "#lib/util/consts";
import { CONTENT_SECURITY_POLICY } from "#lib/util/csp";
import type { Handle } from "@sveltejs/kit/hooks";
import { sequence } from "@sveltejs/kit/hooks";

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(
		event.request,
		({ request: localizedRequest, locale }) =>
			resolve(
				{ ...event, request: localizedRequest },
				{
					transformPageChunk: ({ html }) => {
						return html.replace("%lang%", locale);
					},
				},
			),
	);

// ConVERTer: put the CSP in every prerendered page, so static hosts without custom headers
// (GitHub Pages) also block external requests. right after <meta charset>, as a <meta> CSP only
// applies to what comes after it. see docs/adr/0002
const CHARSET_META = /<meta\s+charset=["']?utf-8["']?[^>]*>/i;
const cspHandle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) => {
			if (!html.includes("<head")) return html; // not the chunk with <head>
			// fail the build loudly rather than ship pages without the CSP
			if (!CHARSET_META.test(html))
				throw new Error(
					"hooks.server.ts: <meta charset> not found in app.html, can't inject the CSP",
				);
			return html.replace(
				CHARSET_META,
				(charset) =>
					`${charset}\n\t\t<meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />`,
			);
		},
	});

export const handle: Handle = DISABLE_ALL_EXTERNAL_REQUESTS
	? sequence(cspHandle, paraglideHandle)
	: paraglideHandle;

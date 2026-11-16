// ConVERTer's Content-Security-Policy: the browser refuses any external request (docs/adr/0002).
// Applied only when PUB_DISABLE_ALL_EXTERNAL_REQUESTS=true, as a <meta> tag (src/hooks.server.ts)
// and as an nginx header (scripts/nginx-csp.ts). Imports nothing, so bun can run the nginx script outside SvelteKit.
//
// 'unsafe-inline' scripts: app.html's theme script and SvelteKit's hydration script are inline. This
// policy is about other hosts, not XSS hardening. 'wasm-unsafe-eval' and blob: are for the WASM engines
// (ffmpeg's multi-threaded core runs its worker from a blob: URL); 'unsafe-eval' is for wasm-vips,
// whose embind bindings build functions from strings.
const DIRECTIVES: Record<string, string[]> = {
	"default-src": ["'self'"],
	"script-src": [
		"'self'",
		"'unsafe-inline'",
		"'unsafe-eval'",
		"'wasm-unsafe-eval'",
		"blob:",
	],
	"worker-src": ["'self'", "blob:"],
	"connect-src": ["'self'", "blob:", "data:"],
	"img-src": ["'self'", "blob:", "data:"],
	"media-src": ["'self'", "blob:", "data:"],
	"font-src": ["'self'", "data:"],
	"style-src": ["'self'", "'unsafe-inline'"],
	"manifest-src": ["'self'"],
	"object-src": ["'none'"],
	"base-uri": ["'self'"],
	"form-action": ["'self'"],
};

export const CONTENT_SECURITY_POLICY = Object.entries(DIRECTIVES)
	.map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
	.join("; ");

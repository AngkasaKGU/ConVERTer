# No external requests by default, enforced by CSP

By default ConVERTer makes no external requests: nothing is fetched from any host other than the deployment serving it, so it builds on ADR 0001, which keeps files on the device. Every shipped build (GitHub Pages, the published Docker image, docker-compose and `.env.example`) sets Upstream's `PUB_DISABLE_ALL_EXTERNAL_REQUESTS` to `true`. An operator opts in by setting it to `false`, which turns on Plausible (when a URL is also set) and the About page's GitHub contributor list together.

When the flag is `true`, the browser enforces it as well: nginx sends a Content-Security-Policy limited to the page's own origin, and a SvelteKit handle in `hooks.server.ts` injects the same policy as a `<meta>` tag, so GitHub Pages and other static hosts are covered too. CI builds with the flag on and fails if the prerendered HTML references another host. This catches an Upstream merge that adds a new third-party call, without anyone having to review every merge by hand.

## Considered Options

- **Per-feature opt-in switches**: rejected. They would mean patching Upstream code that reads the single flag, which adds merge conflicts for little gain.
- **Always-strict CSP, even when opted in**: rejected. Operators would have to edit nginx config by hand as well as set the flag, so opting in would no longer be a single switch.
- **Review alone, without CSP**: rejected. Upstream merges are frequent, and one missed hotlink (like the GitHub-hosted avatar on the About page) silently breaks the promise.

## Consequences

- A host the operator owns still counts as external (for example a self-hosted Plausible on another subdomain).
- Dormant Upstream donation code (Stripe) stays in the source unrendered, for the same merge-cost reason as vertd in ADR 0001.
- The CSP only restricts hosts; it is not XSS hardening. It allows `'unsafe-inline'` (app.html's theme script, SvelteKit's hydration script) and `'unsafe-eval'` (wasm-vips builds functions from strings, and fails to start without it).
- New in-browser engines that need other sources (`blob:`, `data:`, eval) must be allowed in the CSP, or they will fail when the flag is on.

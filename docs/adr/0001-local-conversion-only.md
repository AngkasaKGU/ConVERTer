# Local conversion only, with vertd disabled rather than deleted

ConVERTer only does local conversion: files, including video, never leave the user's device, so Upstream's video conversion server (vertd) is never contacted. Formats that Upstream sends to vertd fall back to the in-browser converters.

vertd is switched off with a hard-coded `LOCAL_ONLY` constant, checked at the places that already gate vertd, rather than by deleting the vertd converter, settings and dialogs. ConVERTer keeps merging changes from Upstream, and deleting that code would cause merge conflicts on every Upstream change that touches it. The constant is deliberately not an env var, so no deployment can re-enable server uploads.

## Considered Options

- **Reuse `PUB_DISABLE_ALL_EXTERNAL_REQUESTS`**: rejected. It also turns off Plausible and the About page's GitHub contributor list, and it can be changed per deployment.
- **Delete vertd outright**: rejected while ConVERTer tracks Upstream. Reconsider if the fork stops merging.

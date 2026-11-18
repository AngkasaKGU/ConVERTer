# Coding standards

ConVERTer is a fork of upstream VERT: `main` mirrors upstream, `converter` holds the fork's changes, and upstream arrives by merging `main` into `converter`. These rules are judgement calls for review. CI already enforces the mechanical ones (typecheck, lint, Prettier on changed files, build, and `bun run check:branding` for "VERT" in messages and "vert.sh" in `src/`/`static/`, `bun run check:external` for requests to other hosts, and `bun run check:fonts` for served fonts without an unmodified license text), so leave those to CI.

When reviewing an upstream merge, apply every rule to the code upstream added, not only to the fork's own edits.

## Local conversion only

Every code path that can contact the vertd video conversion server is gated by `VERTD_ENABLED` (from `#lib/util/consts`), directly or by only running when the `vertd` converter is registered. Look for new `vertdFetch` calls, `VertdInstance.url()`, `getVertdLimit`, health checks, and new vertd-dependent UI, settings or upload warnings. Reasoning: [ADR-0001](docs/adr/0001-local-conversion-only.md).

## Product name vs upstream credit

User-facing text that names the product says **ConVERTer**; text that credits or refers to the upstream project says **VERT** (terms in [GLOSSARY.md](GLOSSARY.md)). The branding check only scans messages and "vert.sh", so review hard-coded strings in components and TypeScript yourself: toasts, dialogs, error messages, file-picker descriptions, `<title>`/meta content, and new upstream links (`VERT-sh/VERT`) that should point at the fork repo (`GITHUB_URL_FORK`). Visual identity follows the same rule: ConVERTer uses its own Unbounded wordmark (`Logo.svelte`) and "C" mark (`converter-mark.svg`, `favicon.png`, `lettermark*`), so VERT logo assets an upstream merge brings back (the "V" mark, the VERT wordmark) are removed.

## Minimal edits to upstream code

Change upstream files with the smallest contained edit that works: a gate, a prop, a constant, or not rendering a component. Leave upstream code ConVERTer doesn't use (vertd, Donate, Why, unused messages) in place rather than deleting or reformatting it, so merges stay clean. Fork-only additions go in new files where practical, with a short `// ConVERTer:` comment on edits to upstream lines that a future merge would otherwise undo.

**Exception: license compliance.** A change that keeps ConVERTer's third-party licenses in order may go beyond a minimal edit, even when that causes merge conflicts. In particular, remove unused upstream dependencies that ship licensed content (fonts, assets), such as the unused `@fontsource` fonts, so that what ConVERTer depends on matches the license texts it serves from `static/licenses/`. When an upstream merge brings such a dependency back, remove it again or add its license text. The license texts themselves are never edited: see `static/licenses/fonts/SOURCES.md`.

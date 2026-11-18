## Deploying ConVERTer on Vercel

### 1. Click the Vercel Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AngkasaKGU/ConVERTer&project-name=converter&repository-name=ConVERTer)

### 2. Configure build settings

| Setting          | Value           |
| ---------------- | --------------- |
| Framework Preset | `SvelteKit`     |
| Build Command    | `bun run build` |
| Output Directory | `build`         |
| Install Command  | `bun install`   |

### 3. Set environment variables

| Variable                            | Example Value                   | Description                                                                                                |
| ----------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `PUB_ENV`                           | `production`                    | Application environment (required for SvelteKit static build)                                              |
| `PUB_HOSTNAME`                      | `converter.example.com`         | Hostname for analytics tracking                                                                            |
| `PUB_PLAUSIBLE_URL`                 | `https://plausible.example.com` | Plausible Analytics URL (leave empty to disable)                                                           |
| `PUB_DISABLE_ALL_EXTERNAL_REQUESTS` | `true`                          | Keep `true` so ConVERTer makes no external requests; it is only `true` when set, so don't leave this unset |
| `PUB_DISABLE_FAILURE_BLOCKS`        | `false`                         | Set `true` to prevent blocking on repeated video conversion failures                                       |

ConVERTer converts everything locally and never uses a video conversion server, so there is no `PUB_VERTD_URL` to set.

### 4. Deploy

Click **Deploy**. Vercel will build the project with SvelteKit using the settings above.

This method uses Vercel’s native build system and is easy to update and maintain.

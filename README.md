<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/converter-logo-dark.svg" />
    <img src="docs/images/converter-logo-light.svg" alt="ConVERTer" height="60" />
  </picture>
</p>
<h1 align="center">ConVERTer</h1>

ConVERTer is a file conversion utility that uses WebAssembly to convert files on your device instead of a cloud. Every conversion, including video, happens locally in your browser: files never leave your device.

ConVERTer is a modified version of [VERT](https://github.com/VERT-sh/VERT), changed from 13 November 2026 onwards. It is built in Svelte and TypeScript.

## Features

- Convert files directly on your device using WebAssembly
- No file or file size limits
- Convert images, audio, documents, and video
- Supports over **250+** file formats
- Conversion settings
- User-friendly interface built with Svelte

## Documentation

- [FAQ](./docs/FAQ.md)
- [Getting Started](./docs/GETTING_STARTED.md)
- [Using Docker](./docs/DOCKER.md)

## License

This project is licensed under the AGPL-3.0 License, please see the [LICENSE](LICENSE) file for details.

### Fonts

The fonts ConVERTer serves are licensed separately, under the SIL Open Font License 1.1. Their license texts are served with the app at `/licenses/fonts/` and linked from the Credits on the About page:

- Host Grotesk: [static/licenses/fonts/HostGrotesk-OFL.txt](static/licenses/fonts/HostGrotesk-OFL.txt)
- Radio Canada Big: [static/licenses/fonts/RadioCanadaBig-OFL.txt](static/licenses/fonts/RadioCanadaBig-OFL.txt)

The logo is set in [Unbounded](https://github.com/googlefonts/unbounded) (SIL OFL 1.1), converted to outlines, so no Unbounded font file ships. Where each license text came from is recorded in [static/licenses/fonts/SOURCES.md](static/licenses/fonts/SOURCES.md).

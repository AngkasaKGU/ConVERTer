# Font license sources

ConVERTer serves these fonts, both under the SIL Open Font License 1.1. Each license file in this folder is an unmodified copy of the one its upstream ships. The OFL forbids changing its text, so don't edit, reformat or re-wrap these files, not even trailing whitespace.

| Font                 | License file                                     | Copied from                                                                                                                                                                              | SHA-256                                                            |
| -------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Host Grotesk         | [HostGrotesk-OFL.txt](HostGrotesk-OFL.txt)       | [`OFL.txt` in Element-Type/HostGrotesk at `ab2ba6769119e7ae71aa2fab46eedcb993c670a3`](https://github.com/Element-Type/HostGrotesk/blob/ab2ba6769119e7ae71aa2fab46eedcb993c670a3/OFL.txt) | `386b93abff8765eeae26a8e4cf58421e724e15cd5317cec8101df84e4693687e` |
| Radio Canada Big 600 | [RadioCanadaBig-OFL.txt](RadioCanadaBig-OFL.txt) | `LICENSE` in the npm package `@fontsource/radio-canada-big@5.3.0`                                                                                                                        | `9cbe86de4121a0a8e5e8bcb4f2e07dcd0384485ddf120b05b90204e643ca4d64` |

The logo is Unbounded Bold converted to outlines, so no Unbounded font file ships and no license file is needed for it.

`bun run check:fonts` fails when a font in `build/` has no license file here containing its copyright notice (name table ID 0), or when a license file's SHA-256 doesn't match the table above.

To add or update a license: copy the upstream file in unchanged, update its row (source and pinned version), and set its hash from `sha256sum <file>`.

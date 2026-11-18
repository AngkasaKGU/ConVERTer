<script lang="ts">
	// ConVERTer: credits the fonts it serves and links their SIL OFL texts (static/licenses/fonts/).
	// Rendered regardless of DISABLE_ALL_EXTERNAL_REQUESTS: the license links are same-origin,
	// and the Unbounded link only navigates.
	import { m } from "#lib/paraglide/messages";
	import { link, sanitize } from "#lib/store/index.svelte";
</script>

<div class="flex flex-col gap-1">
	<h2 class="text-base font-bold">{m["about.credits.fonts"]()}</h2>
	<p class="text-base font-normal text-muted">
		{@html sanitize(
			link(
				[
					"host_grotesk_link",
					"radio_canada_big_link",
					"unbounded_link",
				],
				m["about.credits.fonts_description"](),
				[
					"/licenses/fonts/HostGrotesk-OFL.txt",
					"/licenses/fonts/RadioCanadaBig-OFL.txt",
					"https://github.com/googlefonts/unbounded",
				],
				[true, true, true],
				["underline", "underline", "underline"],
			),
		)}
	</p>
</div>

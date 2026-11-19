<script lang="ts">
	// ConVERTer: lists the fonts it uses, each linked to its SIL OFL text (static/licenses/fonts/).
	// Rendered regardless of DISABLE_ALL_EXTERNAL_REQUESTS: the license links are same-origin.
	// Font and license names are proper names, so they aren't translated.
	import { asset } from "$app/paths";
	import { m } from "#lib/paraglide/messages";

	const OFL = "SIL OPEN FONT LICENSE Version 1.1";
	const fonts = [
		{ name: "Host Grotesk", license: "licenses/fonts/HostGrotesk-OFL.txt" },
		{
			name: "Radio Canada Big",
			license: "licenses/fonts/RadioCanadaBig-OFL.txt",
		},
		{ name: "Unbounded", license: "licenses/fonts/Unbounded-OFL.txt" },
	] as const; // asset() checks these paths exist in static/
</script>

<div class="flex flex-col gap-1">
	<h2 class="text-base font-bold">{m["about.credits.fonts"]()}</h2>
	<p class="text-base font-normal text-muted">
		{m["about.credits.fonts_description"]()}
	</p>
	<!-- two columns (font | license) from sm up; on phones each license sits under its font -->
	<dl
		class="mt-1 grid gap-y-2 text-base sm:grid-cols-[max-content_1fr] sm:gap-x-8 sm:gap-y-1"
	>
		{#each fonts as { name, license } (name)}
			<div class="sm:col-span-2 sm:grid sm:grid-cols-subgrid">
				<dt class="font-semibold">{name}</dt>
				<dd class="font-normal text-muted">
					<a
						class="underline"
						href={asset(license)}
						target="_blank"
						rel="noopener noreferrer">{OFL}</a
					>
				</dd>
			</div>
		{/each}
	</dl>
</div>

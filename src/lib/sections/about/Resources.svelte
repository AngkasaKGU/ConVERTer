<script lang="ts">
	import Panel from "#lib/components/visual/Panel.svelte";
	import { GITHUB_URL_FORK } from "#lib/util/consts";
	import { effects } from "#lib/store/index.svelte";
	import { CodeXmlIcon, LinkIcon } from "@lucide/svelte";
	import clsx from "clsx";
	import { m } from "#lib/paraglide/messages";
</script>

<Panel class="flex flex-col gap-4 p-6">
	<h2 class="flex items-center text-2xl font-bold">
		<div
			class="mr-3 inline-block h-10 w-10 rounded-full bg-accent-purple p-2"
		>
			<LinkIcon color="black" />
		</div>
		{m["about.resources.title"]()}
	</h2>
	<div class="flex gap-3">
		<a
			href={GITHUB_URL_FORK}
			target="_blank"
			rel="external noopener noreferrer"
			class={clsx(
				"btn flex flex-1 items-center justify-center gap-2 rounded-full bg-button p-4 text-black dynadark:text-white",
				!$effects && "!scale-100",
			)}
		>
			<CodeXmlIcon size="24" class="mr-2 inline-block" />
			{m["about.resources.source"]()}
		</a>
	</div>
</Panel>

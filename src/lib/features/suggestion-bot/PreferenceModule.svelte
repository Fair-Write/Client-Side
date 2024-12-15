<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	let { toPreferenceModule }: { toPreferenceModule: () => void } = $props();
</script>

<div>
	<div
		class="flex h-14 w-full items-center justify-between gap-2 border-b border-solid border-stone-300 bg-stone-50 p-5"
	>
		<div class="flex items-center justify-start gap-2">
			<span class="material-symbols-outlined s36 text-stone-500">psychology</span>
			<h2 class="text-xl font-semibold">Preference</h2>
		</div>

		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<span class="material-symbols-outlined s26 text-stone-500">info</span>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>blah blah blah blah</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>

	<div class="group flex flex-col items-center justify-between p-5">
		<button class="flex items-center justify-start gap-2" onclick={() => toPreferenceModule()}>
			<span class="material-symbols-outlined s26 text-stone-500">arrow_back</span>
			<span class="text-base group-hover:underline"> Back </span>
		</button>
	</div>
</div>

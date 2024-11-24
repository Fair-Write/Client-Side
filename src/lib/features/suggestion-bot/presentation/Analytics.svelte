<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
	import Gauge from '$lib/features/suggestion-bot/presentation/Steps/Gauge.svelte';
	import ExportButton from '$lib/features/suggestion-bot/presentation/Utils/ExportButton.svelte';

	let { backToTheStart }: { backToTheStart: () => void } = $props();
</script>

<div class="flex w-full flex-col items-center justify-stretch gap-2 pl-4">
	<Gauge radius={100} percent={50}></Gauge>

	<Card.Root>
		<Card.Header>
			<Card.Title class="border-b border-dashed border-stone-500 pb-2 text-lg font-bold "
				>Useful Articles:</Card.Title
			>
		</Card.Header>
		<Card.Content class="text-base text-blue-500">
			<ul class="list-outside list-disc px-3">
				<li class="hover:underline">
					<a target="_blank" href="https://www.google.com" rel="noopener noreferrer"
						>How we detect gender fair language</a
					>
				</li>
				<li class="mt-2 hover:underline">
					<a target="_blank" href="https://www.google.com" rel="noopener noreferrer"
						>What is gender fair language</a
					>
				</li>
			</ul>
		</Card.Content>
	</Card.Root>
	<Button
		variant="outline"

		onclick={backToTheStart}
		class="flex w-full items-center  justify-between border border-blue-500 bg-blue-50 p-6 text-base font-bold text-blue-500 hover:bg-blue-500 hover:text-blue-50"
		><p>Start All Over Again</p>

		<span class="material-symbols-outlined s26"> restart_alt</span>
	</Button>
	<ExportButton></ExportButton>
</div>

<style>
</style>

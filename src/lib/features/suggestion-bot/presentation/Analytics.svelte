<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
	import Gauge from '$lib/features/suggestion-bot/presentation/Steps/Gauge.svelte';
	import ExportButton from '$lib/features/suggestion-bot/presentation/Utils/ExportButton.svelte';
	import { GLFScore } from '$lib/stores/omegaLOL';
	import { textContent } from '$lib/stores/textFromEditorStore';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { countStore } from '$lib/stores/countStore';

	let { backToTheStart }: { backToTheStart: () => void } = $props();

	function getTheDifferential(wrong: number, total: number) {
		if (total == 0) {
			return 0;
		}

		return wrong / total;
	}

	let difference = $derived.by(() => {
		return getTheDifferential($GLFScore, $textContent.split(' ').length);
	});

	// let doubled = $derived.by(() => {
	// 	if (difference == 0) {
	// 		return 100;
	// 	} else if (difference > 0 && difference <= 0.2) {
	// 		return 80;
	// 	} else if (difference > 0.2 && difference <= 0.5) {
	// 		return 50;
	// 	} else if (difference > 0.5 && difference <= 1) {
	// 		return 20;
	// 	} else {
	// 		return 0;
	// 	}
	// });
</script>

<ScrollArea
	class="flex w-full flex-col items-center justify-stretch  pl-4 lg:h-[550px] 2xl:h-[850px]"
>
	<Gauge radius={100} percent={difference}></Gauge>

	<Card.Root class="my-2">
		<Card.Header>
			<Card.Title class=" border-b border-dashed border-stone-500 pb-2 text-lg font-bold"
				>Fair Write's Total Scanned Files:</Card.Title
			>
		</Card.Header>
		<Card.Content class="text-base text-blue-500">
			<p class="text-center text-base font-bold text-green-500">
				{$countStore} Scanned Documents
			</p>
		</Card.Content>
	</Card.Root>

	<Card.Root class="my-2">
		<Card.Header>
			<Card.Title class=" border-b border-dashed border-stone-500 pb-2 text-lg font-bold"
				>Useful Articles:</Card.Title
			>
		</Card.Header>
		<Card.Content class="text-base text-blue-500">
			<ul class="list-outside list-disc px-3">
				<li class="hover:underline">
					<a
						target="_blank"
						href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00025/full"
						rel="noopener noreferrer"
						>How we gender fair language can reduce gender stereotyping and discrimination</a
					>
				</li>
				<li class="mt-2 hover:underline">
					<a
						target="_blank"
						href="https://pcieerd.dost.gov.ph/images/gad_corner/Gender-fair-language-a-primer.pdf"
						rel="noopener noreferrer">What is gender fair language</a
					>
				</li>
			</ul>
		</Card.Content>
	</Card.Root>
	<Button
		variant="outline"
		onclick={backToTheStart}
		class="my-2 flex w-full items-center justify-between border border-blue-500 bg-blue-50 p-6 text-base font-bold text-blue-500 hover:bg-blue-500 hover:text-blue-50"
		><p>Start All Over Again</p>

		<span class="material-symbols-outlined s26"> restart_alt</span>
	</Button>
	<ExportButton></ExportButton>
</ScrollArea>

<style>
</style>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { progressStore } from '$lib/stores/progressStore';
	import SuggestionCard from './SuggestionCard.svelte';
	let { nextSlide }: { nextSlide: () => void } = $props();
	let isCompact = $state<boolean>(false);
	function removeMe() {
		alert('popped');
	}
	const payloadTest = $state({
		heading: 'Testing',
		revisionText: 'foo',
		originalText: 'bar',
		suggestionType: 'grammar'
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="border-b border-dashed border-stone-500 pb-2 font-bold"
			>Step 2: Grammar Check</Card.Title
		>
		<Card.Description
			>Here is the list of Gender Fair appropriate words that I can suggest</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<Button
			class="w-full"
			onclick={() => {
				nextSlide();
				$progressStore = 100;
			}}>Proceed</Button
		>
	</Card.Content>

	<!--compact	-->
</Card.Root>

<ScrollArea class="h-[500px]">
	<Card.Root class="my-3 ">
		{#if !isCompact}
			<Card.Header class="">
				<Card.Title
					class="flex items-center justify-between border-b border-dashed border-stone-500 pb-2 font-bold"
				>
					<div class="flex items-center justify-center gap-2">
						<div class="h-[10px] w-[10px] rounded-full bg-blue-500">&nbsp;</div>
						Grammar
					</div>

					<button
						class="material-symbols-outlined s16 cursor-pointer select-none rounded-full border border-solid border-stone-500 p-1 text-stone-500"
						onclick={() => (isCompact = true)}
					>
						collapse_content</button
					>
				</Card.Title>
			</Card.Header>
			<Card.Content class="p-5 py-3">
				<p class="pb-2 text-sm">
					<span class="font-bold text-red-500">Orginal:</span> given there physical strength and cowrage
				</p>
				<p class="text-sm">
					<span class="font-bold text-blue-500">Revision:</span> given there physical strength and courage
				</p>
			</Card.Content>
			<Card.Footer class="flex flex-col items-stretch justify-start gap-2 p-5 pt-3">
				<button
					onclick={nextSlide}
					class=" flex items-center justify-center rounded-[9px] border border-solid border-blue-500 bg-gradient-to-t from-indigo-700 to-blue-300 p-[1px] transition-all ease-in-out hover:border-sky-500 hover:from-blue-500 hover:to-sky-200"
				>
					<span
						class="w-full rounded-[8px] bg-gradient-to-t from-indigo-700 to-blue-500 p-2 text-base font-bold text-blue-50 transition-all ease-in-out hover:bg-sky-300 hover:from-blue-500 hover:text-sky-100"
					>
						Accept
					</span>
				</button>
				<Button variant="outline" class="font-bold text-stone-500">Ignore</Button>
			</Card.Footer>
		{:else}
			<Card.Content class="flex items-center justify-between p-5 py-3">
				<p class="w-[120px] truncate text-center text-sm">
					<span class="font-bold text-red-500">Orginal</span> given there physical strength and cowrage
				</p>

				<div class="flex items-center justify-center gap-1">
					<button
						class="material-symbols-outlined s16 cursor-pointer select-none rounded-full border border-solid border-red-500 p-1 text-red-500"
						>delete</button
					>
					<button
						class="material-symbols-outlined s16 cursor-pointer select-none rounded-full border border-solid border-stone-500 p-1 text-stone-500"
						onclick={() => (isCompact = false)}
						>expand_content
					</button>
				</div>
			</Card.Content>
		{/if}
	</Card.Root>
	<SuggestionCard {...payloadTest} {removeMe} />
</ScrollArea>

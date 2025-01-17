<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import SuggestionCard from './SuggestionCard.svelte';
	import { aiSuggestions, replaceStore } from '$lib/stores/lintingStore';
	import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
	import { textContent } from '$lib/stores/textFromEditorStore';
	// import { progressStore } from '$lib/stores/progressStore';
	import { revisedTextStore } from '$lib/stores/revisedTextStore';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { toast } from 'svelte-sonner';
	import { signalTextEditor } from '$lib/stores/signalStore';
	// import { toast } from 'svelte-sonner';

	let { nextSlide }: { nextSlide: () => void } = $props();
	let suggestionsReference = $state<TSuggestion[]>($aiSuggestions);
	let isEmpty = $derived(suggestionsReference.length != 0);
	let isLoading = $state(false);

	async function removeMe(index: number) {
		$replaceStore = [$aiSuggestions[index]];
		$aiSuggestions.splice(index, 1);
		suggestionsReference.splice(index, 1);
		// refetch every remove omega lol
	}
	function applyAllChanges() {
		// $replaceStore = $aiSuggestions.map((suggestion) => {
		// 	return suggestion;
		// });

		$textContent = $revisedTextStore;
		$signalTextEditor = true;
		console.log($textContent);

		$aiSuggestions = [];
	}
	function ignoreMe(index: number) {
		$aiSuggestions.splice(index, 1);
		suggestionsReference.splice(index, 1);
	}

	$effect(() => {
		if ($aiSuggestions) {
			suggestionsReference = $aiSuggestions;
		}
	});
</script>

<ScrollArea class="h-[700px] w-full px-3">
	<Card.Root class="w-full ">
		<Card.Header>
			<Card.Title class="border-b border-dashed border-stone-500 pb-2 font-bold"
				>Step 3: Gender Fairness</Card.Title
			>
			<Card.Description
				>Here is the list of Gender Fair appropriate words that I can suggest</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<Button
				class="flex w-full items-center  justify-between border border-blue-500 bg-blue-50  text-base font-bold text-blue-500 hover:bg-blue-500 hover:text-blue-50"
				disabled={isEmpty || isLoading}
				onclick={() => {
					nextSlide();
				}}
			>
				<p>Proceed</p>
				<span class="material-symbols-outlined s16">arrow_forward_ios</span></Button
			>
			<!--	TODO: please add a loading screen for this one kasi magiging multistep -->
			<Button
				class="mt-2 w-full"
				disabled={!isEmpty || isLoading}
				variant="outline"
				onclick={() => {
					applyAllChanges();
				}}>Apply All Changes</Button
			>
		</Card.Content>

		<!--compact	-->
	</Card.Root>

	{#if !isLoading}
		{#key $aiSuggestions}
			{#each suggestionsReference as payload, index}
				<SuggestionCard suggestion={payload} {index} {removeMe} {ignoreMe} />
			{/each}
		{/key}
	{:else}
		<Skeleton class="my-2 h-32 w-full bg-stone-200	" />
		<Skeleton class="my-2 h-32 w-full	bg-stone-200 " />
		<Skeleton class="my-2 h-32 w-full	bg-stone-200" />
	{/if}
</ScrollArea>

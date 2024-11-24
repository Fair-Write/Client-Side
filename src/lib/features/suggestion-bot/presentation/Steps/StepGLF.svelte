<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { progressStore } from '$lib/stores/progressStore';
	import SuggestionCard from './SuggestionCard.svelte';
	import { aiSuggestions, omitObject, replaceStore } from '$lib/stores/lintingStore';
	import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

	let { nextSlide }: { nextSlide: () => void } = $props();
	let suggestionsReference = $state<TSuggestion[]>($aiSuggestions);
	let isEmpty = $derived(suggestionsReference.length != 0);

	function removeMe(index: number) {
		$replaceStore = [omitObject($aiSuggestions[index], 'analysis', 'correctionType', 'heading')];
		$aiSuggestions.splice(index, 1);
	}
	function applyAllChanges() {
		$replaceStore = $aiSuggestions.map((suggestion) => {
			return omitObject(suggestion, 'analysis', 'correctionType');
		});
		$aiSuggestions = [];
	}

	function ignoreMe(index: number) {
		$aiSuggestions.splice(index, 1);
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
				class="flex w-full items-center  justify-between border-2 border-blue-500 bg-blue-50  text-base font-bold text-blue-500 hover:bg-blue-500 hover:text-blue-50"
				disabled={isEmpty}
				onclick={() => {
					nextSlide();
					$progressStore = 100;
				}}
			>
				<p>Proceed</p>
				<span class="material-symbols-outlined s16">arrow_forward_ios</span></Button
			>
			<Button
				class="mt-2 w-full"
				disabled={!isEmpty}
				variant="outline"
				onclick={() => {
					// nextSlide();
					// $progressStore = 100;
					applyAllChanges();
				}}>Apply All Changes</Button
			>
		</Card.Content>

		<!--compact	-->
	</Card.Root>
	{#key $aiSuggestions}
		{#each suggestionsReference as payload, index}
			<SuggestionCard suggestion={payload} {index} {removeMe} {ignoreMe} />
		{/each}
	{/key}
</ScrollArea>

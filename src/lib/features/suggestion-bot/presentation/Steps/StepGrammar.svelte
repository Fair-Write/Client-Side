<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import SuggestionCard from './SuggestionCard.svelte';
	import { get } from 'svelte/store';

	import { aiSuggestions, replaceStore } from '$lib/stores/lintingStore';
	import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { ignoreGrammarStore } from '$lib/stores/ignoreStore';

	let {
		nextSlide,
		backToTheStart
	}: { nextSlide: () => Promise<void>; backToTheStart: () => void } = $props();
	let suggestionsReference = $state<TSuggestion[]>($aiSuggestions);
	let isEmpty = $derived(suggestionsReference.length != 0);

	let isLoading = $state(false);

	function removeMe(index: number, correctionString: string) {
		let suggestion = { ...$aiSuggestions[index] };
		suggestion.chosenReplacement = correctionString;
		$replaceStore = [suggestion];
		$aiSuggestions.splice(index, 1);
		suggestionsReference.splice(index, 1);
	}

	function applyAllChanges() {
		$replaceStore = $aiSuggestions.reverse().map((suggestion) => {
			let sug = { ...suggestion };
			sug.chosenReplacement = suggestion.replacements[0];

			return sug;
		});
		// $textContent = $revisedTextStore;
		// console.log($textContent);
		// $signalTextEditor = true;

		$aiSuggestions = [];
	}

	function ignoreMe(index: number, ignoreString: string) {
		$aiSuggestions.splice(index, 1);
		suggestionsReference.splice(index, 1);
		if (!$ignoreGrammarStore.includes(ignoreString)) {
			$ignoreGrammarStore.push(ignoreString);
		}
		// THIS IS FUCKING STUPID! WHY DO YOU HAVE TO REINSTANTIATE
		$aiSuggestions = [...$aiSuggestions.filter((value) => value.originalText != ignoreString)];
	}

	$effect(() => {
		if ($aiSuggestions) {
			suggestionsReference = $aiSuggestions;
		}
	});

	async function proceed() {
		isLoading = true;
		await nextSlide();

		isLoading = false;
	}
</script>

<ScrollArea class="h-[700px] w-full px-3 ">
	<Card.Root class=" w-full">
		<Card.Header>
			<Card.Title class="border-b border-dashed border-stone-500 pb-2 font-bold"
				>Step 2: Grammar Check</Card.Title
			>
			<Card.Description>Here is the list of grammar corrections that I can suggest</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex flex-col gap-2">
			<Button
				class="flex w-full items-center  justify-between border border-blue-500 bg-blue-50  text-base font-bold text-blue-500 hover:bg-blue-500 hover:text-blue-50"
				disabled={isEmpty || isLoading}
				onclick={proceed}
				><p>Proceed</p>
				{#if isLoading}
					<LoaderCircle class="animate-spin" />
				{:else}
					<span class="material-symbols-outlined s16">arrow_forward_ios</span>
				{/if}
			</Button>
			<Button
				class="flex w-full items-center  justify-between border border-green-500 bg-green-50  text-base font-bold text-green-500 hover:bg-green-500 hover:text-green-50"
				variant="outline"
				onclick={() => {
					backToTheStart();
				}}
				><p>Back To Step 1</p>

				<span class="material-symbols-outlined s26">edit</span>
			</Button>
			<Button
				class=" w-full"
				variant="outline"
				disabled={!isEmpty || isLoading}
				onclick={() => {
					applyAllChanges();
				}}>Apply All Changes</Button
			>
		</Card.Content>

		<!--compact	-->
	</Card.Root>

	{#key $ignoreGrammarStore}
		{#key $aiSuggestions}
			{#each suggestionsReference as payload, index}
				{#if !$ignoreGrammarStore.includes(payload.originalText)}
					<SuggestionCard suggestion={payload} {index} {removeMe} {ignoreMe} />
				{/if}
			{/each}
		{/key}
	{/key}
</ScrollArea>

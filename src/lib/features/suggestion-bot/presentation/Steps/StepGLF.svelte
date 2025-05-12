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
	import { GLFScore } from '$lib/stores/omegaLOL';
	// import { toast } from 'svelte-sonner';

	let {
		nextSlide,
		goBackToGrammar,
		backToTheStart
	}: { nextSlide: () => void; goBackToGrammar: () => void; backToTheStart: () => void } = $props();
	let suggestionsReference = $state<TSuggestion[]>($aiSuggestions);
	let isEmpty = $derived(suggestionsReference.length != 0);
	let isLoading = $state(false);

	function removeMe(index: number, correctionString: string) {
		let suggestion = { ...$aiSuggestions[index] };
		suggestion.chosenReplacement = correctionString;
		$replaceStore = [suggestion];
		$aiSuggestions.splice(index, 1);
		suggestionsReference.splice(index, 1);
		// refetch every remove omega lol
	}
	function applyAllChanges() {
		if ($aiSuggestions[0].correctionType === 'gfl') {
			$GLFScore += $aiSuggestions.length;
		}

		$replaceStore = $aiSuggestions
			.sort((a, b) => b.offSet - a.offSet) // Sort by offSet in ascending order
			.map((suggestion) => {
				let sug = { ...suggestion };
				sug.chosenReplacement = suggestion.replacements[0];

				return sug;
			});

		// $textContent = $revisedTextStore;
		// $signalTextEditor = true;
		// console.log($textContent);

		$aiSuggestions = [];
	}
	function ignoreMe(index: number) {
		$aiSuggestions.splice(index, 1);
		suggestionsReference.splice(index, 1);
		// THIS IS FUCKING STUPID! WHY DO YOU HAVE TO REINSTANTIATE
		$aiSuggestions = [...$aiSuggestions];
	}

	$effect(() => {
		if ($aiSuggestions) {
			suggestionsReference = $aiSuggestions;
		}
	});
</script>

<ScrollArea class="w-full px-3 lg:h-[550px] 2xl:h-[700px]">
	<Card.Root class="w-full ">
		<Card.Header>
			<Card.Title class="border-b border-dashed border-stone-500 pb-2 font-bold"
				>Step 3: Gender Fairness</Card.Title
			>
			<Card.Description
				>Here is the list of Gender Fair appropriate words that I can suggest</Card.Description
			>
		</Card.Header>
		<Card.Content class="flex flex-col gap-2">
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

			<Button
				class="flex w-full items-center  justify-between border border-fuchsia-500 bg-fuchsia-50  text-base font-bold text-fuchsia-500 hover:bg-fuchsia-500 hover:text-fuchsia-50"
				variant="outline"
				onclick={() => {
					goBackToGrammar();
				}}
			>
				<p>Check Grammar</p>
				<span class="material-symbols-outlined s26">abc</span>
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
				class="w-full"
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

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import SuggestionCard from './SuggestionCard.svelte';
	import { aiSuggestions, replaceStore } from '$lib/stores/lintingStore';
	import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
	import { textContent } from '$lib/stores/textFromEditorStore';
	import { LoaderCircle } from 'lucide-svelte';

	let { nextSlide }: { nextSlide: () => Promise<void> } = $props();
	let suggestionsReference = $state<TSuggestion[]>($aiSuggestions);
	let isEmpty = $derived(suggestionsReference.length != 0);

	let isLoading = $state(false);
	function isStringOrArrayOfStrings(value: string | string[]) {
		// It's a string
		if (typeof value === 'string') {
			return value;
		}

		//  && value.every((item) => typeof item === 'string')
		// It's an array of strings
		if (Array.isArray(value)) {
			return value[0];
		}
// It's neither a string nor an array of strings
		return false;
	}

	async function removeMe(index: number) {
		$replaceStore = [$aiSuggestions[index]];
		$aiSuggestions.splice(index, 1);
		isLoading = true;
		try {
			const post = await fetch('http://127.0.0.1:8080/grammar', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ prompt: $textContent })
			});

			const data = await post.json();
			console.log(data);

			if (Object.keys(data).length !== 0) {
				let suggestions: Promise<TSuggestion[]> = data.corrections.map(
					(correction: {
						word_index: number;
						character_offset: number;
						character_endset: number;
						original_text: string;
						message: string;
						replacements: string[];
					}) => ({
						indexReplacement: correction.word_index,
						originalText: correction.original_text,
						offSet: correction.character_offset,
						endSet: correction.character_endset,
						replacement: isStringOrArrayOfStrings(correction.replacements),
						correctionType: 'grammar',
						message: correction.message,
						rational: ''
					})
				);

				$aiSuggestions = await suggestions;
				isLoading = false;
				console.log($aiSuggestions);
				await nextSlide();

			} else {
				await nextSlide();
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
	function applyAllChanges() {
		$replaceStore = $aiSuggestions.map((suggestion) => {
			return suggestion;
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

	async function proceed() {
		isLoading = true;
		await nextSlide();

		isLoading = false;
	}
</script>

<ScrollArea class="h-[700px] w-full px-3 ">
	<Card.Root class="h-[250px] w-full">
		<Card.Header>
			<Card.Title class="border-b border-dashed border-stone-500 pb-2 font-bold"
				>Step 2: Grammar Check</Card.Title
			>
			<Card.Description>Here is the list of grammar corrections that I can suggest</Card.Description
			>
		</Card.Header>
		<Card.Content>
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
				class="mt-2 w-full"
				variant="outline"
				disabled={!isEmpty || isLoading}
				onclick={() => {

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

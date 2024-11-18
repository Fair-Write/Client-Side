<script lang="ts">
	// import { aiSuggestions, omitObject } from '$lib/stores/lintingStore';
	// import { Button } from '$lib/components/ui/button';
	// import { replaceStore } from '$lib/stores/lintingStore';
	import StepWrite from '$lib/features/suggestion-bot/presentation/Steps/StepWrite.svelte';
	import StepInfographic from '$lib/features/suggestion-bot/presentation/Steps/StepInfographic.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import StepGrammar from '$lib/features/suggestion-bot/presentation/Steps/StepGrammar.svelte';
	import StepGLF from '$lib/features/suggestion-bot/presentation/Steps/StepGLF.svelte';
	import Analytics from '$lib/features/suggestion-bot/presentation/Analytics.svelte';

	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { progressStore } from '$lib/stores/progressStore';
	import { aiSuggestions } from '$lib/stores/lintingStore';
	let api = $state<CarouselAPI>();

	function nextSlide() {
		if (api) {
			api.scrollNext();
		}
	}

	function initPayload() {
		$aiSuggestions = [
			{
				heading: 'Change to plural',
				wrongPhrase: 'firemen is',
				correctPhrase: 'firemen are',
				correctionType: 'grammar',
				analysis: 5
			},
			{
				heading: 'Missing Article',
				wrongPhrase: 'to enforce law and order',
				correctPhrase: 'to enforce law and order;',
				correctionType: 'grammar',
				analysis: 5
			},
			{
				heading: 'Wrong Spelling',
				wrongPhrase: 'physical strength and cowrage',
				correctPhrase: 'physical strength and courage',
				correctionType: 'spelling',
				analysis: 5
			},

			{
				heading: 'Subject-Verb Agreement',
				wrongPhrase: 'prepare them',
				correctPhrase: 'prepares them',
				correctionType: 'grammar',
				analysis: 5
			},
			{
				heading: 'Wrong Spelling',
				wrongPhrase: 'knowed',
				correctPhrase: 'known',
				correctionType: 'spelling',
				analysis: 5
			},
		];
		nextSlide();
	}

	function goBackFromStart() {
		if (api) {
			api.scrollTo(0);
			$progressStore = 0;
		}
	}
</script>

<!--TODO:-->
<!--create a step by step thingy ma bob-->
<!-- 1. writing -->
<!-- 2. grammar -->
<!-- 3. GFL -->
<!-- 4. analytics -->
<section class=" h-full min-h-0 border-l border-stone-300 bg-stone-100 lg:w-80">
	<div
		class="flex h-14 w-full items-center justify-between border-b border-solid border-stone-300 bg-stone-50 p-5"
	>
		<h2 class="text-xl font-semibold">AI Companion</h2>
		<span class="material-symbols-outlined s26 text-stone-500">settings</span>
	</div>

	<div class="flex flex-col items-center justify-between">
		<StepInfographic></StepInfographic>

		<Carousel.Root
			class="w-[280px]"
			setApi={(emblaApi) => (api = emblaApi)}
			opts={{ dragFree: true, watchDrag: false }}
		>
			<Carousel.Content>
				<Carousel.Item><StepWrite nextSlide={initPayload}></StepWrite></Carousel.Item>
				<Carousel.Item><StepGrammar {nextSlide}></StepGrammar></Carousel.Item>
				<Carousel.Item><StepGLF></StepGLF></Carousel.Item>
				<Carousel.Item><Analytics></Analytics></Carousel.Item>
			</Carousel.Content>
			<button
				onclick={() => {
					if (api) {
						api.scrollNext();
					}
				}}
			>
				NEXT</button
			>

			<button
				onclick={() => {
					if (api) {
						api.scrollPrev();
					}
				}}
			>
				Previous</button
			>
			<button onclick={goBackFromStart}>From the start</button>
		</Carousel.Root>

		<!--		<Button-->
		<!--			onclick={() => {-->
		<!--				$replaceStore = $aiSuggestions.map((suggestions) =>-->
		<!--					omitObject(suggestions, 'analysis', 'correctionType')-->
		<!--				);-->
		<!--			}}-->
		<!--		>-->
		<!--			REPLACE ALL-->
		<!--		</Button>-->
		<!--		{#each $aiSuggestions as suggestion}-->
		<!--			<div class="my-5 flex flex-col gap-2">-->
		<!--				<p>wrong phrase: {suggestion.wrongPhrase}</p>-->
		<!--				<p>correct phrase: {suggestion.correctPhrase}</p>-->
		<!--				<Button-->
		<!--					onclick={() => {-->
		<!--						$replaceStore = [omitObject(suggestion, 'analysis', 'correctionType')];-->
		<!--					}}>replace/Button-->
		<!--				>-->
		<!--			</div>-->
		<!--		{/each}-->
	</div>
</section>

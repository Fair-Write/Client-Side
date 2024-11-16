<script lang="ts">
	// import { aiSuggestions, omitObject } from '$lib/stores/lintingStore';
	// import { Button } from '$lib/components/ui/button';
	// import { replaceStore } from '$lib/stores/lintingStore';
	import StepWrite from '$lib/features/suggestion-bot/presentation/StepWrite.svelte';
	import StepInfographic from '$lib/features/suggestion-bot/presentation/StepInfographic.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import StepGrammar from '$lib/features/suggestion-bot/presentation/StepGrammar.svelte';
	import StepGLF from '$lib/features/suggestion-bot/presentation/StepGLF.svelte';
	import Analytics from '$lib/features/suggestion-bot/presentation/Analytics.svelte';

	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	let api = $state<CarouselAPI>();

	function nextSlide() {
		if (api) {
			api.scrollNext();
		}
	}

	function goBackFromStart() {
		if (api) {
			api.scrollTo(1);
		}
	}
</script>

<!--TODO:-->
<!--create a step by step thingy ma bob-->
<!-- 1. writing -->
<!-- 2. grammar -->
<!-- 3. GFL -->
<!-- 4. analytics -->
<section class=" h-[100svh] min-h-0 border-l border-stone-300 bg-stone-100 lg:w-80">
	<div
		class="flex h-14 w-full items-center justify-between border-b border-solid border-stone-300 bg-stone-50 p-5"
	>
		<h2 class="text-xl font-semibold">AI Companion</h2>
		<span class="material-symbols-outlined s26 text-stone-500">settings</span>
	</div>

	<div class="p-5">
		<StepInfographic></StepInfographic>

		<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
			<Carousel.Content>
				<Carousel.Item><StepWrite {nextSlide}></StepWrite></Carousel.Item>
				<Carousel.Item><StepGrammar></StepGrammar></Carousel.Item>
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

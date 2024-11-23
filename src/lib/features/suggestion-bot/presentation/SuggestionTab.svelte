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
				analysis: 5,
				rationale: 'lorem ipsum somethign something'
			},
			{
				heading: 'Missing Article',
				wrongPhrase: 'to enforce law and order',
				correctPhrase: 'to enforce law and order;',
				correctionType: 'grammar',
				analysis: 5,
				rationale: 'lorem ipsum somethign something'
			},
			{
				heading: 'Wrong Spelling',
				wrongPhrase: 'physical strength and cowrage',
				correctPhrase: 'physical strength and courage',
				correctionType: 'spelling',
				analysis: 5,
				rationale: 'lorem ipsum somethign something'
			},

			{
				heading: 'Subject-Verb Agreement',
				wrongPhrase: 'prepare them',
				correctPhrase: 'prepares them',
				correctionType: 'grammar',
				analysis: 5,
				rationale: 'lorem ipsum somethign something'
			},
			{
				heading: 'Wrong Spelling',
				wrongPhrase: 'knowed',
				correctPhrase: 'known',
				correctionType: 'spelling',
				analysis: 5,
				rationale: 'lorem ipsum somethign something'
			}
		];
		nextSlide();
	}

	function initGLF() {
		setTimeout(() => {
			$aiSuggestions = [
				{
					heading: 'Change to firefighter',
					wrongPhrase: 'firemen',
					correctPhrase: 'firefighter',
					correctionType: 'gfl',
					analysis: 5,
					rationale: 'lorem ipsum somethign something'
				},
				{
					heading: 'Change to Police Officers',
					wrongPhrase: 'policemen',
					correctPhrase: 'police officer',
					correctionType: 'gfl',
					analysis: 5,
					rationale: 'lorem ipsum somethign something'
				},
				{
					heading: 'Change to Police Officers',
					wrongPhrase: 'policewomen',
					correctPhrase: 'police officers',
					correctionType: 'gfl',
					analysis: 5,
					rationale: 'lorem ipsum somethign something'
				},

				{
					heading: 'Change to firefighters',
					wrongPhrase: 'lady firefighters',
					correctPhrase: 'firefighters',
					correctionType: 'gfl',
					analysis: 5,
					rationale: 'lorem ipsum somethign something'
				},
				{
					heading: 'Change to businessperson',
					wrongPhrase: 'businessman',
					correctPhrase: 'businessperson',
					correctionType: 'gfl',
					analysis: 5,
					rationale: 'lorem ipsum somethign something'
				},
				{
					heading: 'Change to chairperson',
					wrongPhrase: 'chairmen',
					correctPhrase: 'chairperson',
					correctionType: 'gfl',
					analysis: 5,
					rationale: 'lorem ipsum somethign something'
				},
				{
					heading: 'Change to salesmen',
					wrongPhrase: 'salesmen',
					correctPhrase: 'salesperson',
					correctionType: 'gfl',
					analysis: 5,
					rationale: 'lorem ipsum somethign something'
				},
				{
					heading: 'Change to salesmen',
					wrongPhrase: 'salesmen',
					correctPhrase: 'salesperson',
					correctionType: 'gfl',
					analysis: 5,
					rationale: 'lorem ipsum somethign something'
				}
			];
		}, 500);
		nextSlide();
	}

	function backToTheStart() {
		if (api) {
			api.scrollTo(0);
			$progressStore = 0;
		}
	}
</script>

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
			<Carousel.Content class="w-[280px]">
				<Carousel.Item><StepWrite nextSlide={initPayload}></StepWrite></Carousel.Item>
				<Carousel.Item><StepGrammar nextSlide={initGLF}></StepGrammar></Carousel.Item>
				<Carousel.Item><StepGLF {nextSlide}></StepGLF></Carousel.Item>
				<Carousel.Item><Analytics {backToTheStart}></Analytics></Carousel.Item>
			</Carousel.Content>
		</Carousel.Root>
	</div>
</section>

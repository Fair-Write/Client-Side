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
	import { textContent } from '$lib/stores/textFromEditorStore';
	import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
	import { GLFScore } from '$lib/stores/omegaLOL';
	let api = $state<CarouselAPI>();

	function nextSlide() {
		if (api) {
			api.scrollNext();
		}
	}
	function isStringOrArrayOfStrings(value: string | string[]) {
		if (typeof value === 'string') {
			return value; // It's a string
		}

		if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
			return value[0]; // It's an array of strings
		}

		return false; // It's neither a string nor an array of strings
	}

	async function initPayload() {
		//
		// $aiSuggestions = [
		// 	{
		// 		message: 'Change to plural',
		// 		originalText: 'is',
		// 		replacement: 'are',
		// 		correctionType: 'grammar',
		// 		rationale: 'lorem ipsum somethign something',
		// 		offSet: 31,
		// 		endSet:32,
		// 		indexReplacement: 9
		// 	}
		// ];
		// nextSlide()
		try {
			const post = await fetch('http://127.0.0.1:8080/grammar', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ prompt: $textContent })
			});
			if (!post.ok) {
				throw new Error(`HTTP error! status: ${post.status}`);
			}
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
				console.log($aiSuggestions);
				nextSlide();
			} else {
				nextSlide();
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function initGLF() {
		// setTimeout(() => {
		// 	$aiSuggestions = [
		// 		{
		// 			message: 'Change to firefighter',
		// 			originalText: 'firemen',
		// 			replacement: 'firefighter',
		// 			correctionType: 'gfl',
		// 			offSet: 23,
		// 			endSet: 29,
		// 			indexReplacement: 4,
		// 			rationale: 'lorem ipsum somethign something'
		// 		}
		// 	];
		// }, 500);
		// nextSlide();
		try {
			const post = await fetch('http://127.0.0.1:8080/gfl', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ prompt: $textContent })
			});
			if (!post.ok) {
				throw new Error(`HTTP error! status: ${post.status}`);
			}
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
						replacements: string[] | string;
					}) => ({
						indexReplacement: correction.word_index,
						originalText: correction.original_text,
						offSet: correction.character_offset,
						endSet: correction.character_endset,
						replacement: isStringOrArrayOfStrings(correction.replacements),
						correctionType: 'gfl',
						message: 'Gender Fair Language',
						rational: ''
					})
				);

				$GLFScore = (await suggestions).length;

				$aiSuggestions = await suggestions;
				console.log($aiSuggestions);
				nextSlide();
			} else {
				nextSlide();
			}
		} catch (error) {
			console.error('Error:', error);
		}
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
			class="w-[300px]"
			setApi={(emblaApi) => (api = emblaApi)}
			opts={{ dragFree: true, watchDrag: false }}
		>
			<Carousel.Content class="-ml-5">
				<Carousel.Item class="px-5"><StepWrite nextSlide={initPayload}></StepWrite></Carousel.Item>
				<Carousel.Item class=""><StepGrammar nextSlide={initGLF}></StepGrammar></Carousel.Item>
				<Carousel.Item><StepGLF {nextSlide}></StepGLF></Carousel.Item>
				<Carousel.Item class="px-5"><Analytics {backToTheStart}></Analytics></Carousel.Item>
			</Carousel.Content>
		</Carousel.Root>
	</div>
</section>

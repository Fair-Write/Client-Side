<script lang="ts">
	import StepWrite from '$lib/features/suggestion-bot/presentation/Steps/StepWrite.svelte';
	import StepInfographic from '$lib/features/suggestion-bot/presentation/Steps/StepInfographic.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import StepGrammar from '$lib/features/suggestion-bot/presentation/Steps/StepGrammar.svelte';
	import StepGLF from '$lib/features/suggestion-bot/presentation/Steps/StepGLF.svelte';
	import Analytics from '$lib/features/suggestion-bot/presentation/Analytics.svelte';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { progressStore } from '$lib/stores/progressStore';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { buttonVariants } from '$lib/components/ui/button';

	import {
		glfCheckService,
		grammarCheckService
	} from '$lib/features/suggestion-bot/services/suggestionBotServices';
	import PreferenceModule from '$lib/features/suggestion-bot/presentation/PreferenceModule.svelte';

	let api = $state<CarouselAPI>();
	let isSuggestionsTab = $state<boolean>(true);
	let tabIndex = $state<number>(0);

	$effect(() => {
		if ($progressStore === 0) {
			if (api) {
				api.scrollTo(0);
				$progressStore = 0;
			}
		}
	});

	$effect(() => {
		if (isSuggestionsTab) {
			api?.scrollTo(tabIndex);
		}
	});

	function nextSlide() {
		if (api) {
			api.scrollNext();
			tabIndex = api.selectedScrollSnap();
		}
	}
	function toPreferenceModule() {
		isSuggestionsTab = !isSuggestionsTab;
	}

	async function grammarPayload() {
		await grammarCheckService(nextSlide);
	}

	async function goBackToGrammar() {
		if (api) {
			api.scrollTo(1);
			$progressStore = 0;
		}
		await grammarCheckService(nextSlide);
	}
	// might export this as a service instead
	async function glfPayload() {
		await glfCheckService(nextSlide);
	}

	function backToTheStart() {
		if (api) {
			api.scrollTo(0);
			$progressStore = 0;
		}
	}
</script>

<section class=" h-full border-l border-stone-300 bg-stone-100 sm:w-full md:w-64 2xl:w-80">
	{#if isSuggestionsTab}
		<!-- Grammar & GLF Suggestion Module -->
		<div
			class="flex h-14 w-full items-center justify-between border-b border-solid border-stone-300 bg-stone-50 p-5"
		>
			<h2 class="text-xl font-semibold">AI Companion</h2>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger
						class={buttonVariants({ variant: 'outline' })}
						onclick={() => (isSuggestionsTab = !isSuggestionsTab)}
					>
						<span class="material-symbols-outlined s26 text-stone-500">settings</span
						></Tooltip.Trigger
					>
					<Tooltip.Content>
						<p>Preference Settings</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>

		<div class="flex flex-col items-center justify-between">
			<StepInfographic></StepInfographic>

			<Carousel.Root
				class="w-[250px] 2xl:w-[300px]"
				setApi={(emblaApi) => (api = emblaApi)}
				opts={{ dragFree: true, watchDrag: false }}
			>
				<Carousel.Content class="-ml-5">
					<Carousel.Item class="px-5"
						><StepWrite nextSlide={grammarPayload}></StepWrite></Carousel.Item
					>
					<Carousel.Item class=""><StepGrammar nextSlide={glfPayload}></StepGrammar></Carousel.Item>
					<Carousel.Item><StepGLF {goBackToGrammar} {nextSlide}></StepGLF></Carousel.Item>
					<Carousel.Item class="px-5"><Analytics {backToTheStart}></Analytics></Carousel.Item>
				</Carousel.Content>
			</Carousel.Root>
		</div>
	{:else}
		<!--  Preference Module-->
		<PreferenceModule {toPreferenceModule}></PreferenceModule>
	{/if}
</section>

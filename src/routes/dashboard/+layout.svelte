<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import SuggestionBot from '$lib/features/suggestion-bot/presentation/suggestionBot.svelte';
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=history_edu"
	/>
</svelte:head>

<div class="flex flex-1 bg-stone-100">
	<div class="flex w-64 flex-col justify-between gap-2 border-r border-solid border-stone-300">
		<!-- wrapper -->

		<div class="flex flex-col gap-1 *:px-2">
			<div
				class="flex h-14 items-center justify-start border-b border-solid border-stone-300 bg-stone-50"
			>
				<span class="material-symbols-outlined s20"> history_edu </span>
				<h1 class="font-Leckerli-One text-2xl">Fair Write</h1>
			</div>

			<div
				class="mb-5 flex h-14 items-center justify-start border-b border-dashed border-stone-400"
			>
				<h3 class=" text-xl font-semibold text-stone-400">Features</h3>
			</div>
			<!-- editor and scan -->
			<nav class="flex flex-col gap-2 *:px-2">
				<a
					href="/dashboard/editor"
					class={cn(
						'rounded-lg border border-transparent p-2  text-xl transition-all ease-in-out',
						' hover:bg-stone-200 ',
						$page.url.pathname === '/dashboard/editor' &&
							'border-solid border-stone-300 bg-stone-50 shadow-md hover:bg-stone-50'
					)}
				>
					Editor
				</a>
				<a
					href="/dashboard/scan"
					class={cn(
						'rounded-lg border border-transparent  p-2 text-xl    transition-all ease-in-out',
						' hover:bg-stone-200 ',
						$page.url.pathname === '/dashboard/scan' &&
							'border-solid border-stone-300 bg-stone-50 shadow-md hover:bg-stone-50 '
					)}>Scan</a
				>
			</nav>
		</div>

		<!-- info -->
		<a href="/dashboard/info" class="border-t border-stone-300 p-2 text-xl">Info</a>
	</div>
	<main class="flex flex-1 bg-stone-200">
		<slot></slot>
		<SuggestionBot></SuggestionBot>
	</main>
</div>

<style>
	span.s20 {
		font-size: 40px;
		font-variation-settings: 'OPSZ' 40;
	}
</style>

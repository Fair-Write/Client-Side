<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import SuggestionBot from '$lib/features/suggestion-bot/presentation/suggestionBot.svelte';
</script>

<div class="flex flex-1 bg-stone-100">
	<div class="flex w-64 flex-col justify-between gap-2 border-r border-solid border-stone-300">
		<!-- wrapper -->

		<div class="flex flex-col gap-1 *:px-2">
			<div
				class="flex h-14 items-center justify-center gap-2 border-b border-solid border-stone-300 bg-stone-50 lg:justify-start"
			>
				<span class="material-symbols-outlined s40"> history_edu</span>
				<h1 class="hidden font-Leckerli-One text-2xl lg:inline">Fair Write</h1>
			</div>

			<div class="mb-5 hidden border-b border-dashed border-stone-400 px-3 py-2 lg:inline">
				<h3 class=" text-xl font-semibold text-stone-400">Features</h3>
			</div>
			<!-- editor and scan -->
			<nav class="flex flex-col gap-2 *:px-2">
				<a
					href="/dashboard/editor"
					class={cn(
						'flex items-center justify-start gap-2  rounded-lg border border-transparent p-2 text-xl transition-all ease-in-out',
						' hover:bg-stone-200 ',
						$page.url.pathname === '/dashboard/editor' &&
							'border-solid border-stone-300 bg-stone-50 shadow-md hover:bg-stone-50'
					)}
				>
					<!--stupid icon-->
					<span
						class=" flex items-center justify-center rounded-[9px] border border-solid border-green-500 bg-gradient-to-t from-emerald-700 to-green-300 p-[1px]"
					>
						<span
							class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-emerald-700 to-green-500 p-1 text-green-50"
						>
							edit_document</span
						></span
					>

					<span class="hidden lg:inline">Editor</span>
				</a>
				<a
					href="/dashboard/scan"
					class={cn(
						'flex items-center justify-start gap-2 rounded-lg border border-transparent  p-2 text-xl    transition-all ease-in-out',
						' hover:bg-stone-200 ',
						$page.url.pathname === '/dashboard/scan' &&
							'border-solid border-stone-300 bg-stone-50 shadow-md hover:bg-stone-50 '
					)}
				>
					<!--stupid icon-->
					<span
						class=" flex items-center justify-center rounded-[9px] border border-solid border-sky-500 bg-gradient-to-t from-blue-700 to-sky-300 p-[1px]"
					>
						<span
							class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-blue-700 to-sky-500 p-1 text-sky-50"
						>
							scan</span
						></span
					>
					<span class=" hidden lg:inline">Scan</span>
				</a>
			</nav>
		</div>

		<!-- info -->
		<a
			href="/dashboard/info"
			class="flex items-center justify-center lg:justify-start  gap-2 border-t border-stone-300 p-2 text-xl"
		>
			<!--stupid icon-->
			<span
				class=" flex items-center justify-center rounded-[9px] border border-solid border-stone-500 bg-gradient-to-t from-neutral-700 to-stone-300 p-[1px]"
			>
				<span
					class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-neutral-700 to-stone-500 p-1 text-stone-50"
				>
					info</span
				></span
			>

			<span class="hidden lg:inline">Info</span></a
		>
	</div>
	<main class="flex flex-1 bg-stone-200">
		<slot></slot>
		<SuggestionBot></SuggestionBot>
	</main>
</div>

<style>
	span.s40 {
		font-size: 40px;
		font-variation-settings: 'OPSZ' 40;
	}

	span.s26 {
		font-size: 26px;
		font-variation-settings: 'OPSZ' 26;
	}
</style>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import SuggestionTab from '$lib/features/suggestion-bot/presentation/SuggestionTab.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
</script>

<div class="flex flex-1 bg-stone-100">
	<div
		class="flex flex-col justify-between gap-2 border-r border-solid border-stone-300 sm:w-auto md:w-48 2xl:w-64"
	>
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

		<Dialog.Root>
			<Dialog.Trigger>
				<div
					class="flex items-center justify-center gap-2 border-t border-stone-300 p-2 text-xl lg:justify-start"
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

					<span class="hidden lg:inline">Info</span>
				</div>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>What's Fair Write?</Dialog.Title>
					<Dialog.Description>
						&nbsp; Fair Write, a web-based text editing application integrated with gender-fair
						language capabilities. Fair Write provides suggestions and corrections to help users
						avoid biased or gender-exclusive terms in their writing. Whether drafting professional
						documents, academic papers, or casual content,
						<br />
						<br />
						&nbsp; Its integrated features include intelligent grammar checking, inclusive vocabulary
						alternatives, and style recommendations aligned with current gender-sensitive language standards.
						Fair Write is an essential tool for individuals and organizations striving for more conscious
						and inclusive communication.
					</Dialog.Description>
				</Dialog.Header>
			</Dialog.Content>
		</Dialog.Root>

		<!-- info -->
	</div>
	<main class=" flex flex-1 shrink-0 basis-0 flex-col bg-stone-200 lg:flex-row">
		<slot></slot>
		<SuggestionTab></SuggestionTab>
	</main>
</div>

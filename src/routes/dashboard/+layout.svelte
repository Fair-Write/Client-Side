<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import SuggestionBot from '$lib/features/suggestion-bot/presentation/suggestionBot.svelte';
</script>

<div class="flex flex-1 bg-stone-100">
	<div class="flex w-64 flex-col justify-between gap-2 border-r border-solid border-stone-300">
		<!-- wrapper -->

		<div class="flex flex-col gap-1 *:px-2">

			<div class="h-14 border-stone-300 border-b border-solid bg-stone-50 flex items-center justify-start ">
				<h1 class="text-2xl font-Leckerli-One ">Fair Write</h1>
			</div>

			<div class="flex h-14 items-center justify-start border-b border-dashed border-stone-400 mb-5">
				<h3 class=" text-xl font-semibold text-stone-400">Features</h3>
			</div>
			<!-- editor and scan -->
      <nav class="flex flex-col gap-2 *:px-2">
        <a
          href="/dashboard/editor"
          class={cn(
					'rounded-lg border border-transparent p-2 text-xl ',
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
					'rounded-lg border border-transparent  p-2 text-xl',
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

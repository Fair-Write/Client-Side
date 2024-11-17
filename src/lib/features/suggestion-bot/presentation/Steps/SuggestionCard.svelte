<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	let isCompact = $state<boolean>(false);
	let {
		heading,
		revisionText,
		originalText,
		suggestionType,
		removeMe
	}: {
		heading: string;
		revisionText: string;
		originalText: string;
		suggestionType: string;
		removeMe: () => void;
	} = $props();
</script>

<Card.Root class="my-3 ">
	{#if !isCompact}
		<Card.Header class="">
			<Card.Title
				class="flex items-center justify-between border-b border-dashed border-stone-500 pb-2 font-bold"
			>
				<div class="flex items-center justify-center gap-2">
					<div
						class={cn(
							'h-[10px] w-[10px] rounded-full',
							suggestionType === 'grammar' && 'bg-blue-500',
							suggestionType === 'spelling' && 'bg-red-500'
						)}
					>
						&nbsp;
					</div>
					{heading}
				</div>

				<button
					class="material-symbols-outlined s16 cursor-pointer select-none rounded-full border border-solid border-stone-500 p-1 text-stone-500"
					onclick={() => (isCompact = true)}
				>
					collapse_content</button
				>
			</Card.Title>
		</Card.Header>
		<Card.Content class="p-5 py-3">
			<p class="pb-2 text-sm">
				<span class="font-bold text-red-500">Orginal:</span>
				{originalText}
			</p>
			<p class="text-sm">
				<span class="font-bold text-blue-500">Revision:</span>{revisionText}
			</p>
		</Card.Content>
		<Card.Footer class="flex flex-col items-center justify-start gap-2 p-5 pt-3">
			<button
				class={cn(
					'flex w-full items-center justify-center rounded-[9px] border border-solid p-[1px]',
					suggestionType == 'grammar' &&
						'border-blue-500 bg-gradient-to-t from-indigo-700 to-blue-300 p-[1px] transition-all ease-in-out hover:border-sky-500 hover:from-blue-500 hover:to-sky-200',
					suggestionType == 'spelling' &&
						'border-red-500 bg-gradient-to-t from-rose-700 to-red-300 p-[1px] transition-all ease-in-out hover:border-red-700 hover:from-red-700 hover:to-red-200'
				)}
				onclick={removeMe}
			>
				<span
					class={cn(
						'w-full rounded-[8px] bg-gradient-to-t p-2 text-base font-bold transition-all ease-in-out',
						suggestionType == 'grammar' &&
							'from-indigo-700 to-blue-500  text-blue-50 hover:bg-sky-300 hover:from-blue-500 hover:text-sky-100 ',
						suggestionType == 'spelling' &&
							'w-full from-rose-700 to-red-500  text-red-50 hover:bg-red-200 hover:from-red-500 hover:to-red-400  hover:text-red-50'
					)}
				>
					Accept
				</span>
			</button>
			<Button variant="outline" class="font-bold text-stone-500">Ignore</Button>
		</Card.Footer>
	{:else}
		<Card.Content class="flex items-center justify-between p-5 py-3">
			<p class="w-[120px] truncate text-center text-sm">
				<span class="font-bold text-red-500">Orginal</span> given there physical strength and cowrage
			</p>

			<div class="flex items-center justify-center gap-1">
				<button
					class="material-symbols-outlined s16 cursor-pointer select-none rounded-full border border-solid border-red-500 p-1 text-red-500"
					>delete</button
				>
				<button
					class="material-symbols-outlined s16 cursor-pointer select-none rounded-full border border-solid border-stone-500 p-1 text-stone-500"
					onclick={() => (isCompact = false)}
					>expand_content
				</button>
			</div>
		</Card.Content>
	{/if}
</Card.Root>

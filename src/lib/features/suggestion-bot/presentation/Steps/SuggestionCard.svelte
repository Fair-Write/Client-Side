<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

	let isCompact = $state<boolean>(false);
	let {
		suggestion,
		removeMe,
		index,
		ignoreMe
	}: {
		suggestion: TSuggestion;
		removeMe: (index: number) => void;
		index: number;
		ignoreMe: (index: number) => void;
	} = $props();
</script>

<Card.Root class="my-3">
	{#if !isCompact}
		<Card.Header class="px-3 py-2">
			<Card.Title
				class="flex items-center justify-between border-b border-dashed border-stone-500 pb-2 text-base "
			>
				<div class="flex items-center justify-center gap-2">
					<div
						class={cn(
							'h-[10px] w-[10px] rounded-full',
							suggestion.correctionType === 'grammar' && 'bg-blue-500',
							suggestion.correctionType === 'spelling' && 'bg-red-500',
							suggestion.correctionType === 'gfl' && 'bg-violet-500'
						)}
					>
						&nbsp;
					</div>
					{suggestion.message}
				</div>

				<button
					class="material-symbols-outlined s18 cursor-pointer select-none rounded-full border border-solid border-stone-500 p-1 text-stone-500 hover:bg-stone-500 hover:text-stone-50 hover:transition-all hover:ease-in-out"
					onclick={() => (isCompact = true)}
				>
					collapse_content</button
				>
			</Card.Title>
		</Card.Header>
		<Card.Content class="px-2 pt-2 pb-0">
			<p class="text-sm">
				<span class="font-bold text-red-500">Original:&nbsp;</span>
				{suggestion.originalText}
			</p>
			<p class="my-3 text-sm">
				<span class="font-bold text-blue-500">Revision:&nbsp;</span>{suggestion.replacement}
			</p>

		</Card.Content>
		<Card.Footer class="flex flex-col items-center justify-start gap-2 p-3 py-2">
			<button
				class={cn(
					'flex w-full items-center justify-center rounded-[9px] border border-solid p-[1px]',
					suggestion.correctionType === 'grammar' &&
						'border-blue-500 bg-gradient-to-t from-indigo-700 to-blue-300 p-[1px] transition-all ease-in-out hover:border-sky-500 hover:from-blue-500 hover:to-sky-200',
					suggestion.correctionType === 'spelling' &&
						'border-red-500 bg-gradient-to-t from-rose-700 to-red-300 p-[1px] transition-all ease-in-out hover:border-red-700 hover:from-red-700 hover:to-red-200',
					suggestion.correctionType === 'gfl' &&
						'border-violet-500 bg-gradient-to-t from-purple-700 to-violet-300 p-[1px] transition-all ease-in-out hover:border-violet-700 hover:from-violet-700 hover:to-violet-200'
				)}
				onclick={() => removeMe(index)}
			>
				<span
					class={cn(
						'w-full rounded-[8px] bg-gradient-to-t p-1 text-base font-bold transition-all ease-in-out',
						suggestion.correctionType === 'grammar' &&
							'from-indigo-700 to-blue-500  text-blue-50 hover:bg-sky-300 hover:from-blue-500 hover:text-sky-100 ',
						suggestion.correctionType === 'spelling' &&
							'w-full from-rose-700 to-red-500  text-red-50 hover:bg-red-200 hover:from-red-500 hover:to-red-400  hover:text-red-50',
						suggestion.correctionType === 'gfl' &&
							'w-full from-purple-700 to-violet-500  text-violet-50 hover:bg-violet-200 hover:from-violet-500 hover:to-violet-400  hover:text-violet-50'
					)}
				>
					Accept
				</span>
			</button>
			<Button
				variant="outline"
				size="sm"
				class="w-full text-base font-bold text-stone-500 "
				onclick={() => {
					ignoreMe(index);
				}}>Ignore</Button
			>
		</Card.Footer>
	{:else}
		<Card.Content class="flex items-center justify-between px-3 py-2">
			<div
				class={cn(
					'h-[10px] w-[10px] rounded-full',
					suggestion.correctionType === 'grammar' && 'bg-blue-500',
					suggestion.correctionType === 'spelling' && 'bg-red-500',
					suggestion.correctionType === 'gfl' && 'bg-violet-500'
				)}
			>
				&nbsp;
			</div>

			<p class="inline w-[120px] truncate text-start text-sm">
				{suggestion.message}
			</p>

			<div class="flex items-center justify-center gap-1">
				<button
					class="material-symbols-outlined s18 cursor-pointer select-none rounded-full border border-solid border-red-500 bg-transparent p-1 text-red-500 hover:bg-red-500 hover:text-red-50 hover:transition-all hover:ease-in-out"
					onclick={() => ignoreMe(index)}>delete</button
				>
				<button
					class="material-symbols-outlined s18 cursor-pointer select-none rounded-full border border-solid border-stone-500 bg-transparent p-1 text-stone-500 hover:bg-stone-500 hover:text-stone-50 hover:transition-all hover:ease-in-out"
					onclick={() => (isCompact = false)}
					>expand_content
				</button>
			</div>
		</Card.Content>
	{/if}
</Card.Root>

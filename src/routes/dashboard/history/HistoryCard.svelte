<script lang="ts">
	import type { History } from './historyManager';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formatDistanceStrict } from 'date-fns';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Trash } from 'lucide-svelte';
	import { textContent, textContentHTML, textTitle } from '$lib/stores/textFromEditorStore';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';

	const { history, deleteFunc }: { history: History; deleteFunc: (id: number) => void } = $props();
</script>

<div
	class="w-full border-4 border-dashed border-transparent p-1 transition-all duration-100 ease-out hover:border-blue-500 hover:transition-all"
>
	<Card.Root
		class="flex w-full cursor-pointer flex-row items-center justify-center p-2 "
		onclick={() => {
			$textContent = history.text;
			$textContentHTML = history.htmlAsText;
			$textTitle = history.title;
			goto('/dashboard/editor');
		}}
	>
		<Card.Header class="flex w-full flex-row items-center justify-between gap-2 p-0">
			<div>
				<Card.Title class="mb-1">
					{history.title}
				</Card.Title>
				<p
					class={cn(
						history.type == 'Grammar' && 'text-blue-300',
						history.type == 'GFL' && 'text-violet-300',
						'font-bold'
					)}
				>
					{history.type}
				</p>
			</div>
		</Card.Header>
		<Card.Content class="max-w-[500px] p-0">
			<p class="line-clamp-1 text-justify text-base">
				{history.text}
			</p>
		</Card.Content>
		<Card.Footer class="flex w-full items-center justify-end gap-5 p-0">
			<p class="text-base text-muted-foreground">
				{formatDistanceStrict(history.timestamp, new Date())} ago
			</p>
			<Button
				onclick={(e) => {
					e.stopPropagation();
					deleteFunc(history.id);
				}}
				size="icon"
				variant="destructive"
			>
				<Trash></Trash>
			</Button>
		</Card.Footer>
	</Card.Root>
</div>

<script lang="ts">
	import type { History } from './historyManager';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formatDistanceStrict } from 'date-fns';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Trash } from 'lucide-svelte';
	import { textContent, textTitle } from '$lib/stores/textFromEditorStore';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';

	const { history, deleteFunc }: { history: History; deleteFunc: (id: number) => void } = $props();
</script>

<div
	class="border-4 border-dashed border-transparent p-1 transition-all duration-100 ease-out hover:border-blue-500 hover:transition-all"
>
	<Card.Root
		class="aspect-3/2 w-[250px]  cursor-pointer 2xl:w-[400px] "
		onclick={() => {
			$textContent = history.htmlAsText;
			$textTitle = history.title;
			goto('/dashboard/editor');
		}}
	>
		<Card.Header class="flex w-full flex-row items-center justify-between gap-2">
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
		</Card.Header>
		<Card.Content class="pt-4">
			<p class="line-clamp-5 text-justify text-base">
				{history.text}
			</p>
		</Card.Content>
		<Card.Footer class="flex items-center justify-end">
			<p class="text-base text-muted-foreground">
				{formatDistanceStrict(history.timestamp, new Date())} ago
			</p>
		</Card.Footer>
	</Card.Root>
</div>

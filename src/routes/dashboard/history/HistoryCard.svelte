<script lang="ts">
	import type { History } from './historyManager';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formatDistanceStrict } from 'date-fns';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Trash } from 'lucide-svelte';
	import { text } from '@sveltejs/kit';
	import { textContent, textTitle } from '$lib/stores/textFromEditorStore';
	const { history, deleteFunc }: { history: History; deleteFunc: (id: number) => void } = $props();
	import { goto } from '$app/navigation';
</script>

<button
	class="border-4 border-dashed border-transparent p-1 transition-all duration-100 ease-out hover:border-blue-500 hover:transition-all"
	onclick={() => {
		$textContent = history.htmlAsText;
		$textTitle = history.title;
		goto('/dashboard/editor');
	}}
>
	<Card.Root class="aspect-3/2 w-[250px]  2xl:w-[400px] ">
		<Card.Header class="flex w-full flex-row items-center justify-between gap-2">
			<Card.Title class="">
				{history.title}
			</Card.Title>
			<Button
				onclick={() => {
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
</button>

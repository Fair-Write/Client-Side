<script lang="ts">
	import { onMount } from 'svelte';
	import { HistoryManager, type History } from './historyManager';
	import { formatDistanceStrict } from 'date-fns';
	import HistoryCard from './HistoryCard.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let historyManager: HistoryManager;
	let history = $state<History[]>([]);
	onMount(async () => {
		historyManager = await new HistoryManager();
		history = await historyManager.getAllStore();
	});

	const poop =
		'Consequatur officiis repudiandae quia sit reiciendis molestiae voluptate. Perspiciatis dolorem aut architecto sit aliquam et voluptatem. Qui ducimus dolorum tenetur rerum dolorum. Repudiandae magnam nihil architecto odio aut ipsam qui. Aut suscipit excepturi voluptas. Reiciendis enim doloremque vel sit dolor vero eaque nesciunt.';
</script>

<div
	class="flex h-[100svh] min-h-0 w-full flex-col items-center overflow-y-scroll bg-stone-200 lg:flex-1"
>
	<div
		class=" flex h-14 w-full items-center justify-between border-b border-stone-300 bg-stone-50 p-2"
	>
		<h2 class="text-xl font-semibold">History</h2>
	</div>
	<div class="flex w-full items-center justify-end gap-5 p-5">
		<!-- <button
			onclick={async () => {
				await historyManager.addStore({ text: poop, timestamp: new Date() });
				history = await historyManager.getAllStore();
			}}
		>
			ADD</button
		> -->

		<Button
			variant="destructive"
			onclick={async () => {
				await historyManager.clearAll();
			}}>Clear All</Button
		>
	</div>

	<div class="flex w-full flex-wrap items-start justify-start gap-2 px-5">
		{#key history}
			{#each history as item}
				<HistoryCard {...item}></HistoryCard>
			{/each}
		{/key}
	</div>
</div>

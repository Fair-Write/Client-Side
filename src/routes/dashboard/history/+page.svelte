<script lang="ts">
	import { onMount } from 'svelte';
	import { HistoryManager, type History } from './historyManager';
	import { formatDistanceStrict } from 'date-fns';
	let historyManager: HistoryManager;
	let history = $state<History[]>([]);
	onMount(async () => {
		historyManager = await new HistoryManager();
		history = await historyManager.getAllStore();
	});
</script>

<div class="flex h-[100svh] min-h-0 w-full flex-col items-center bg-stone-200 lg:flex-1">
	<div
		class=" flex h-14 w-full items-center justify-between border-b border-stone-300 bg-stone-50 p-2"
	>
		<h2 class="text-xl font-semibold">History</h2>
	</div>
	<div class="flex w-full flex-1 items-start justify-center lg:items-center">
		{#key history}
			{#each history as item}
				<p>{item.text}</p>
				<p>{formatDistanceStrict(item.timestamp, new Date())}</p>
			{/each}
		{/key}

		<button
			onclick={async () => {
				await historyManager.addStore({ text: 'Test', timestamp: new Date() });
			}}
		>
			ADD</button
		>
		<button
			onclick={async () => {
				console.log(await historyManager.getAllStore());
			}}
		>
			Get all
		</button>
		<button
			onclick={async () => {
				await historyManager.clearAll();
			}}>Clear All</button
		>
	</div>
</div>

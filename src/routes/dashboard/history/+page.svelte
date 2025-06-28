<script lang="ts">
	import { onMount } from 'svelte';
	import { type History } from './historyManager';
	import HistoryCard from './HistoryCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	let history = $state<History[]>([]);

	let manager = $state({
		manager: null as null | InstanceType<typeof import('./historyManager').HistoryManager>
	});
	onMount(async () => {
		const { HistoryManager } = await import('./historyManager');
		manager.manager = new HistoryManager();
		history = (await manager.manager.getAllStore()).reverse();
	});
	async function deleteFunc(id: number) {
		await manager.manager!.deleteStore(id);
		history = (await manager.manager!.getAllStore()).reverse();
	}
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
		<Button
			variant="destructive"
			onclick={async () => {
				await manager.manager!.clearAll();
				history = (await manager.manager!.getAllStore()).reverse();
			}}>Clear All</Button
		>
	</div>

	{#key history}
		{#if history.length == 0}
			<div class="flex h-full w-full flex-wrap items-center justify-center gap-2 px-5">
				<h3 class="mb-10 scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground">
					EMPTY
				</h3>
			</div>
		{:else}
			<ScrollArea class="h-[580px] w-full">
				<div class="flex w-full flex-col flex-wrap items-center justify-start">
					{#each history as item}
						<HistoryCard history={item} {deleteFunc}></HistoryCard>
					{/each}
				</div>
			</ScrollArea>
		{/if}
	{/key}
</div>

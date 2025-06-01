<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import SuggestionTab from '$lib/features/suggestion-bot/presentation/SuggestionTab.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { onMount } from 'svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import {
		type SortingState,
		type PaginationState,
		type ColumnFiltersState,
		type RowSelectionState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';

	import { Button } from '$lib/components/ui/button/index.js';
	import type { PageData } from './$types.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import AddTermForm from './AddTermForm.svelte';

	import AdminNavbar from './AdminNavbar.svelte';

	import { columns, type TGenderTermProcessed } from './column';
	import { getList } from './service.js';
	import { listStore, refreshStore } from '$lib/stores/refreshStore.js';
	import { Toaster } from 'svelte-sonner';
	let burger = $state<TGenderTermProcessed[]>([]);
	let burger2 = $state<TGenderTermProcessed[]>([]);
	let sorting = $state<SortingState>([]);
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});

	async function loadEverything() {
		burger = [];
		burger2 = [];
		$listStore = [];
		const list = await getList();
		if (!list) return;

		for (const [key, value] of Object.entries(list)) {
			burger2.push({ term: key, alternatives: value.toLocaleString() });
		}

		burger = [...burger2];
		$listStore = [...burger2];
		console.log($listStore);
	}

	onMount(() => {
		loadEverything();
	});

	$effect(() => {
		if ($refreshStore > 0) {
			loadEverything();
		}
	});

	const table = createSvelteTable({
		get data() {
			return burger;
		},
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});

	let { data }: { data: PageData } = $props();
	let deleteDialogOpen = $state(false);
	function openDeleteDialog() {
		deleteDialogOpen = true;
		// Keep dropdown open when dialog opens
	}

	function handleDeleteDialogClose() {
		deleteDialogOpen = false;
	}
</script>

<Toaster richColors position="top-center"></Toaster>

<main class="h-[100svh] min-h-0 w-full flex-col items-center bg-stone-100">
	{#key $listStore}
		<AdminNavbar></AdminNavbar>

		<div class="p-2">
			<div class="flex items-center gap-2 py-4">
				<Input
					placeholder="Filter by Term..."
					value={(table.getColumn('term')?.getFilterValue() as string) ?? ''}
					onchange={(e) => {
						table.getColumn('term')?.setFilterValue(e.currentTarget.value);
					}}
					oninput={(e) => {
						table.getColumn('term')?.setFilterValue(e.currentTarget.value);
					}}
					class="max-w-xs"
				/>
				<AddTermForm {data}></AddTermForm>
			</div>
			<div class="">
				<Table.Root>
					<Table.Header>
						{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
							<Table.Row>
								{#each headerGroup.headers as header (header.id)}
									<Table.Head>
										{#if !header.isPlaceholder}
											<FlexRender
												content={header.column.columnDef.header}
												context={header.getContext()}
											/>
										{/if}
									</Table.Head>
								{/each}
							</Table.Row>
						{/each}
					</Table.Header>
					<Table.Body>
						{#each table.getRowModel().rows as row (row.id)}
							<Table.Row data-state={row.getIsSelected() && 'selected'}>
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell class="border-t border-t-stone-300">
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell colspan={columns.length} class="h-24 text-center"
									>No results.</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
				<div class="flex items-center justify-end space-x-2 border-t border-t-stone-300 py-4">
					<div class="flex flex-1 items-center justify-between gap-2">
						<Button
							size="sm"
							variant="destructive"
							onclick={openDeleteDialog}
							disabled={table.getSelectedRowModel().rows.length == 0}>Delete Selected Row(s)</Button
						>
						<div class="flex-1 text-sm text-muted-foreground">
							{table.getFilteredSelectedRowModel().rows.length} of{' '}
							{table.getFilteredRowModel().rows.length} row(s) selected.
						</div>
					</div>
					<div class="flex items-center justify-center gap-2">
						<p class="text-sm text-muted-foreground">
							page {table.getState().pagination.pageIndex + 1} out of {table.getPageCount()}
						</p>
						<Button
							variant="outline"
							size="sm"
							onclick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onclick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>

		<Dialog.Root bind:open={deleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Are you absolutely sure?</Dialog.Title>
					<Dialog.Description>
						This action cannot be undone. This will permanently delete {table.getFilteredSelectedRowModel()
							.rows.length} term/s and their alternative/s.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Button variant="destructive">Delete</Button>
					<Button variant="outline" onclick={() => (deleteDialogOpen = false)}>Cancel</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{/key}
</main>

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
	import DataTable from './data-table.svelte';
	import { columns, type TGenderTermProcessed } from './column';
	const burger: TGenderTermProcessed[] = [
		{ term: 'waiter', alternatives: ['server'] },
		{ term: 'waitress', alternatives: ['server'] },
		{ term: 'policeman', alternatives: ['police officer'] },
		{ term: 'policewoman', alternatives: ['police officer'] },
		{ term: 'policemen', alternatives: ['police officers'] },
		{ term: 'policewomen', alternatives: ['police officers'] },
		{ term: 'fireman', alternatives: ['firefighter'] },
		{ term: 'firewoman', alternatives: ['firefighter'] },
		{ term: 'firewomen', alternatives: ['firefighters'] }
	];
	let sorting = $state<SortingState>([]);
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
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
</script>

<main class="h-[100svh] min-h-0 w-full flex-col items-center bg-stone-100">
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
							<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<div class="flex items-center justify-end space-x-2 border-t border-t-stone-300 py-4">
				<div class="flex flex-1 items-center justify-between gap-2">
					<Button
						size="sm"
						variant="destructive"
						disabled={table.getSelectedRowModel().rows.length == 0}>Delete Selected Row(s)</Button
					>
					<div class="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of{' '}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
				</div>

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
</main>

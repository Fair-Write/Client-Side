import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from './data-table-actions.svelte';
import DataTableTerm from './DataTableTerm.svelte';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type TGenderTermProcessed = {
	term: string;
	alternatives: string;
};
export const columns: ColumnDef<TGenderTermProcessed>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'term',
		header: ({ column }) =>
			renderComponent(DataTableTerm, {
				onclick: column.getToggleSortingHandler()
			})
	},

	{
		accessorKey: 'alternatives',
		header: 'Alternatives'
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { term: row.original, index: row.index });
		}
	}
];

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
</script>

<main class="h-[100svh] min-h-0 w-full flex-col items-center bg-stone-100">
	<AdminNavbar></AdminNavbar>

	<DataTable data={burger} {columns}></DataTable>
</main>

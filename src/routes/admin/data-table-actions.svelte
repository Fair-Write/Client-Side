<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { TGenderTermProcessed } from './column';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';

	let { term }: { term: TGenderTermProcessed } = $props();

	// State to control dropdown visibility
	let dropdownOpen = $state(false);
	let editDialogOpen = $state(false);
	let deleteDialogOpen = $state(false);

	// Function to handle dialog open while keeping dropdown open
	function openEditDialog() {
		editDialogOpen = true;
		// Keep dropdown open when dialog opens
		dropdownOpen = true;
	}

	function openDeleteDialog() {
		deleteDialogOpen = true;
		// Keep dropdown open when dialog opens
		dropdownOpen = true;
	}

	// Close dropdown when dialogs close
	function handleEditDialogClose() {
		editDialogOpen = false;
		dropdownOpen = false;
	}

	function handleDeleteDialogClose() {
		deleteDialogOpen = false;
		dropdownOpen = false;
	}
</script>

<DropdownMenu.Root bind:open={dropdownOpen}>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>

			<!-- Edit Dialog -->
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
					openEditDialog();
				}}
			>
				Edit Term
			</DropdownMenu.Item>

			<!-- Delete Dialog -->
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
					openDeleteDialog();
				}}
			>
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<!-- Edit Dialog (outside dropdown) -->
<Dialog.Root bind:open={editDialogOpen} onOpenChange={handleEditDialogClose}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Term</Dialog.Title>
			<Dialog.Description>
				Make changes to the term here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Term</Label>
				<Input id="name" value={term.term} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="username" class="text-right">Alternative</Label>
				<Input id="username" value={term.alternatives} class="col-span-3" />
			</div>
			<p class="text-sm text-muted-foreground">Enter alternative terms (comma-separated).</p>
		</div>
		<Dialog.Footer>
			<Button type="submit" disabled={term.alternatives == '' || term.term == ''}
				>Save changes</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Dialog (outside dropdown) -->
<Dialog.Root bind:open={deleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you absolutely sure?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete the term and it's alternative.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="destructive">Delete</Button>
			<Button variant="outline" onclick={() => (deleteDialogOpen = false)}>Cancel</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

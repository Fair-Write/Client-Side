<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button
			variant="outline"
			class=" rounded-full"
			color="primary"
			on:click={() => {
				console.log('Exporting content');
			}}>Export As</Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item><p class="font-semibold">DOCX</p></DropdownMenu.Item>
			<DropdownMenu.Item><p class="font-semibold">PDF</p></DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

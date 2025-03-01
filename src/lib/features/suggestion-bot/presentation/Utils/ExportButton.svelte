<script lang="ts">
	import Button from '../../../../components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { exportStateAsPDF } from '$lib/features/rich-text-editor/use-case/exportPDF.js';
	import { textContentHTML, textTitle } from '$lib/stores/textFromEditorStore';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';

	async function downloadDocx() {
		const response = await fetch('/api/docx', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ htmlContent: $textContentHTML })
		});

		if (response.ok) {
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${$textTitle}.docx`;
			link.click();
			URL.revokeObjectURL(url);
		} else {
			toast.error('Failed to Export Docx');
			console.error('Failed to generate docx');
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(
			buttonVariants({ variant: 'outline' }),
			'flex w-full items-center  justify-between border border-green-500 bg-green-50 p-6 text-base font-bold text-green-500 hover:bg-green-500 hover:text-green-50'
		)}
	>
		<p>Export As</p>

		<span class="material-symbols-outlined s26"> upgrade</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group class="w-[250px]">
			<DropdownMenu.Item
				class="w-full"
				onclick={() => {
					downloadDocx();
				}}><p class="font-semibold">DOCX</p></DropdownMenu.Item
			>
			<DropdownMenu.Item
				class="w-full"
				onclick={() => {
					console.log($textContentHTML);

					exportStateAsPDF($textContentHTML);
				}}
				><p class="w-full font-semibold">PDF</p>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

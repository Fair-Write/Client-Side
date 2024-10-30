<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import type { EditorState } from 'prosemirror-state';

	import { exportStateAsPDF } from '$lib/features/rich-text-editor/use-case/exportPDF.js';

	let { state }: { state: EditorState } = $props();

	async function downloadDocx() {
		const response = await fetch('/api/docx', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ htmlContent: state.doc.textContent })
		});

		if (response.ok) {
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'document.docx';
			link.click();
			URL.revokeObjectURL(url);
		} else {
			console.error('Failed to generate docx');
		}
	}


</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" class=" rounded-full" color="primary"
			>Export As</Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item
				onclick={()=>{downloadDocx()}} ><p class="font-semibold">DOCX</p></DropdownMenu.Item
			>
			<DropdownMenu.Item onclick={()=> exportStateAsPDF(state)}><p class="font-semibold">PDF</p></DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

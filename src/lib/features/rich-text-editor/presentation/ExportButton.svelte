<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import type { EditorState } from 'prosemirror-state';
	import { exportStateAsDOCX } from '$lib/features/rich-text-editor/use-case/exportDocument';
	import { exportStateAsPDF } from '$lib/features/rich-text-editor/use-case/exportPDF.js';

	let { state }: { state: EditorState } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" class=" rounded-full" color="primary"
			>Export As</Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={() => exportStateAsDOCX(state)}
				><p class="font-semibold">DOCX</p></DropdownMenu.Item
			>
			<DropdownMenu.Item onclick={()=> exportStateAsPDF(state)}><p class="font-semibold">PDF</p></DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<script lang="ts">
	import DragAndDrop from './DragAndDrop.svelte';
	import type { IFileNameDisplay } from '$lib/features/document-scan/entities/FileType';
	import FileNameDisplay from '$lib/features/document-scan/presentation/FileNameDisplay.svelte';
	import { Button } from '$lib/components/ui/button';

	let fileNameDisplay: IFileNameDisplay = $state({
		fileName: undefined,
		fileType: undefined
	});

	function setFileNameDisplay(
		name: string,
		type: 'jpeg' | 'png' | 'docx' | 'pdf' | undefined
	): void {
		fileNameDisplay.fileName = name;
		fileNameDisplay.fileType = type;
	}
</script>

<!--TODO FIX UI -->
<!-- TODO Integrate the JPG TO Text Feature-->

<div class="flex h-[100svh] min-h-0 w-full flex-col items-center bg-stone-200 lg:flex-1">
	<div
		class=" flex h-14 w-full items-center justify-between border-b border-stone-300 bg-stone-50 p-2"
	>
		{#if !fileNameDisplay.fileType}
			<h2 class="text-xl font-semibold">Scan</h2>
		{:else}
			<FileNameDisplay {...fileNameDisplay} />
			<Button variant="outline" class="rounded-full" onclick={() => {}}>Scan another file</Button>
		{/if}
	</div>

	<DragAndDrop {setFileNameDisplay}></DragAndDrop>
</div>

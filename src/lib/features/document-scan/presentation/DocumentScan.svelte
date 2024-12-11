<script lang="ts">
	import DragAndDrop from './DragAndDrop.svelte';
	import type { IFileNameDisplay } from '$lib/features/document-scan/entities/FileType';
	import FileNameDisplay from '$lib/features/document-scan/presentation/FileNameDisplay.svelte';
	import { convertInputToFile } from '../use-case/extractDocument';
	import { textTitle } from '$lib/stores/textFromEditorStore';

	let fileNameDisplay: IFileNameDisplay = $state({
		fileName: undefined,
		fileType: undefined
	});
	let fileDocument = $state<File | null>(null);

	function setFileNameDisplay(
		name: string,
		type: 'jpeg' | 'png' | 'docx' | 'pdf' | undefined
	): void {
		fileNameDisplay.fileName = name;
		$textTitle = name;
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
			<div>
				<label
					class="flex items-center justify-center gap-2 rounded-full border border-solid
			border-sky-700 bg-blue-500 bg-gradient-to-b from-sky-300 to-sky-600 px-3 py-1
			text-blue-50 shadow-lg hover:cursor-pointer"
					for="File_Drop2"
				>
					<span
						class="bg-gradient-to-b from-sky-50 to-sky-200 bg-clip-text text-center text-sm font-semibold text-transparent lg:text-base"
						>Select Another File
					</span>
				</label>
				<input
					onchange={(e) => {
						fileDocument = convertInputToFile(e);
					}}
					id="File_Drop2"
					accept=".pdf,.docx,.png,.jpeg"
					type="file"
					class="hidden"
				/>
			</div>
		{/if}
	</div>

	<DragAndDrop {setFileNameDisplay} {fileDocument}></DragAndDrop>
</div>

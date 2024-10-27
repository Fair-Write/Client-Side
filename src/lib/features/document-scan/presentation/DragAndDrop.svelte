<script lang="ts">
	import { CloudUpload, FolderOpen } from 'lucide-svelte';
	import { dragOverHandler, dropHandler, inputHandler } from '../use-case/dragAndDropEvents';
	import { getSuffix } from '$lib/features/document-scan/use-case/utilts';
	import {
		convertDragToFile,
		convertInputToFile
	} from '$lib/features/document-scan/use-case/extractDocument';
	import FileNameDisplay from '$lib/features/document-scan/presentation/FileNameDisplay.svelte';
	let fileDocument: unknown | File = $state(null);

	let fileSuffix = $derived.by(() => {
		if (fileDocument != null) {
			let doc = fileDocument as File;
			return getSuffix(doc.name);
		}
	});

	let fileName = $derived.by(() => {
		if (fileDocument != null) {
			let doc = fileDocument as File;
			return doc.name;
		} else {
			return '';
		}
	});
</script>

<div class=" w-[600px] flex-1 flex items-center justify-center">
	<form
		class="w-[450px] h-[450px] border-dashed bg-stone-50
		border-stone-300 rounded-sm border-2 flex items-center
		justify-center gap-5 p-5 flex-col"
		ondrop={async (e) => {
			fileDocument = convertDragToFile(e);
			await dropHandler(e);
		}}
		ondragover={(e) => dragOverHandler(e)}
	>
		{#if fileDocument != null}
			<FileNameDisplay {fileName} fileType={fileSuffix}></FileNameDisplay>
		{:else}
			<FolderOpen class="w-[150px] h-[150px] text-stone-500"></FolderOpen>
		{/if}
		<h3 class="text-lg text-stone-500 text-center">Drag your PDF/DOCX/JPG File Here <br /> OR</h3>
		<label
			class="text-blue-50 px-5 py-2 bg-blue-500 hover:cursor-pointer rounded-full flex
			items-center justify-center gap-2 border-sky-700 border-solid border shadow-lg
			bg-gradient-to-b from-sky-300 to-sky-600"
			for="File_Drop"
		>
			<CloudUpload class="w-8 h-8"></CloudUpload>
			<span
				class="bg-gradient-to-b text-center from-sky-50 text-lg font-semibold to-sky-200 bg-clip-text text-transparent"
				>Select File
			</span>
		</label>
		<input
			onchange={async (e) => {
				fileDocument = convertInputToFile(e);
				await inputHandler(e);
			}}
			id="File_Drop"
			accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			type="file"
			class=" hidden"
		/>
	</form>
</div>

<style>
</style>

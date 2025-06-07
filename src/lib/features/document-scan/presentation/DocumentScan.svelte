<script lang="ts">
	import DragAndDrop from './DragAndDrop.svelte';
	import type { IFileNameDisplay } from '$lib/features/document-scan/entities/FileType';
	import FileNameDisplay from '$lib/features/document-scan/presentation/FileNameDisplay.svelte';
	import { convertInputToFile } from '../use-case/extractDocument';
	import { textContent, textContentHTML, textTitle } from '$lib/stores/textFromEditorStore';
	import { aiSuggestions, replaceStore } from '$lib/stores/lintingStore';
	import { GLFScore } from '$lib/stores/omegaLOL';
	import { progressStore } from '$lib/stores/progressStore';
	import { ignoreGrammarStore } from '$lib/stores/ignoreStore';
	let fileNameDisplay: IFileNameDisplay = $state({
		fileName: undefined,
		fileType: undefined
	});
	let fileDocument = $state<File | null>(null);
	let signal = $state<boolean>(false);

	function changeState(e: boolean) {
		$ignoreGrammarStore = [];
		signal = e;
	}
	function setFileNameDisplay(
		name: string,
		type: 'jpg' | 'jpeg' | 'png' | 'docx' | 'pdf' | undefined
	): void {
		fileNameDisplay.fileName = name.replace(/\.[^/.]+$/, '');
		$textTitle = name.replace(/\.[^/.]+$/, '');
		fileNameDisplay.fileType = type;
	}
</script>

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
					class=" flex items-center justify-center gap-2 rounded-full border
			border-solid border-sky-700 bg-blue-500 bg-gradient-to-b from-sky-300 to-sky-600 px-3
			py-1 text-blue-50 shadow-lg hover:cursor-pointer"
					for="File_Drop2"
					id="FileLabel"
				>
					<span
						class="bg-gradient-to-b from-sky-50 to-sky-200 bg-clip-text text-center text-sm font-semibold text-transparent lg:text-base"
						>Select Another File
					</span>
				</label>

				<input
					onchange={(e) => {
						$textContent = '';
						$textContentHTML = '';
						$textTitle = 'Untitled_1';
						$progressStore = 0;
						$GLFScore = 0;
						$aiSuggestions = [];
						$replaceStore = [];
						$ignoreGrammarStore = [];
						fileDocument = convertInputToFile(e);
						signal = true;
					}}
					id="File_Drop2"
					accept=".pdf,.docx,.png,.jpeg,.jpg"
					type="file"
					class="hidden"
				/>
			</div>
		{/if}
	</div>
	<DragAndDrop {setFileNameDisplay} {fileDocument} {changeState} {signal}></DragAndDrop>
</div>

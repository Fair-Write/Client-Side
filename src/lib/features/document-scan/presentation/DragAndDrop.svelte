<script lang="ts">
	import { CloudUpload, FolderOpen, LoaderCircle } from 'lucide-svelte';
	import { dragOverHandler } from '../use-case/dragAndDropEvents';
	import { getSuffix } from '$lib/features/document-scan/use-case/utilts';
	import { signalTextEditor } from '$lib/stores/signalStore';
	import {
		convertDragToFile,
		convertInputToFile
	} from '$lib/features/document-scan/use-case/extractDocument';
	import ProseMirrorDocu from '$lib/features/document-scan/presentation/ProseMirrorDocu.svelte';

	import { toast } from 'svelte-sonner';
	import { textContent, textContentHTML, textTitle } from '$lib/stores/textFromEditorStore';
	import { getTextFromPDF } from '$lib/features/document-scan/use-case/extractPDF';
	import { ocrToText } from '$lib/features/document-scan/use-case/imgToText';
	import { aiSuggestions, replaceStore } from '$lib/stores/lintingStore';
	import { GLFScore } from '$lib/stores/omegaLOL';
	import { progressStore } from '$lib/stores/progressStore';

	let {
		setFileNameDisplay,
		fileDocument,
		signal = false,
		changeState
	}: {
		setFileNameDisplay: (
			name: string,
			type: 'jpg' | 'jpeg' | 'png' | 'docx' | 'pdf' | undefined
		) => void;
		fileDocument: File | null;
		signal: boolean;
		changeState: (e: boolean) => void;
	} = $props();

	let isLoading = $state(false);

	$effect(() => {
		if (signal == true) {
			console.log('Foo');
			setFileNameDisplay(fileName, fileSuffix);
			convertToText(fileDocument as File, fileSuffix);
			signal = false;
			changeState(false);
		}
	});

	let fileSuffix: 'jpg' | 'jpeg' | 'png' | 'docx' | 'pdf' | undefined = $derived.by(() => {
		if (fileDocument) {
			let doc = fileDocument as File;
			return getSuffix(doc.name);
		} else {
			return undefined;
		}
	});

	let fileName = $derived.by(() => {
		if (fileDocument) {
			let doc = fileDocument as File;
			return doc.name;
		} else {
			return '';
		}
	});
	// todo: add store to this stupid shit v
	let extractedText = $state(false);

	async function convertToText(file: File, type: string | undefined) {
		if (!file) {
			throw new Error('File must be a valid file');
		}

		const formData = new FormData();
		formData.append('file', file as File);
		isLoading = true;
		switch (type) {
			case 'docx': {
				console.log('Getting Docx');
				const response = await fetch('/api/extract/docx', { method: 'POST', body: formData });
				const result = await response.json();
				if (result) {
					extractedText = true;
					$textContent = result.data;
					$signalTextEditor = true;
				}

				break;
			}
			case 'pdf': {
				try {
					const pdfText = await getTextFromPDF(file as File);
					console.log('Getting PDF');
					extractedText = true;
					$textContent = pdfText;
					$signalTextEditor = true;
				} catch (e) {
					console.log('Error:', e);
					toast.error('Failed to get PDF');
				}
				break;
			}
			case 'png':
			case 'jpeg':
			case 'jpg': {
				try {
					console.log('Getting PNG');
					const result = await ocrToText(file as File);
					extractedText = true;
					$textContent = result;
					$signalTextEditor = true;
				} catch (e) {
					console.log('Error:', e);
					toast.error('Failed to Scan Image');
				}
				break;
			}
			case undefined: {
				throw new Error('Affix Undefined');
			}
		}
		isLoading = false;
	}
</script>

<div class="flex w-full flex-1 items-start justify-center lg:items-center">
	{#if isLoading}
		<LoaderCircle class="h-[50px] w-[50px] animate-spin self-center" color="#78716c" />
	{:else if extractedText === false}
		<form
			class=" flex h-[350px] w-[250px] flex-col items-center justify-center
		gap-5 rounded-sm border-2 border-dashed border-stone-300
		bg-stone-50 p-5 lg:h-[450px] lg:w-[450px]"
			ondrop={async (e) => {
				$textContent = '';
				$textContentHTML = '';
				$textTitle = 'Untitled_1';
				$progressStore = 0;
				$GLFScore = 0;
				$aiSuggestions = [];
				$replaceStore = [];

				e.preventDefault();
				fileDocument = convertDragToFile(e);
				setFileNameDisplay(fileName, fileSuffix);
				await convertToText(fileDocument, fileSuffix);
			}}
			ondragover={(e) => dragOverHandler(e)}
		>
			<FolderOpen class="h-24 w-24 text-stone-500 lg:h-[150px] lg:w-[150px]"></FolderOpen>
			<h3 class="text-center text-lg text-stone-500">Drag your PDF/DOCX/JPG File Here <br /> OR</h3>
			<label
				class=":ease-in-out flex items-center justify-center gap-2 rounded-full border
			border-solid border-sky-700 bg-blue-500 bg-gradient-to-b from-sky-300 to-sky-600 px-5
			py-2 text-blue-50 shadow-lg duration-100 hover:cursor-pointer hover:hue-rotate-[-90deg] hover:transition-all
			hover:duration-100 hover:ease-in-out active:scale-95 active:transform"
				for="File_Drop"
			>
				<CloudUpload class="h-8 w-8"></CloudUpload>
				<span
					class="bg-gradient-to-b from-sky-50 to-sky-200 bg-clip-text text-center text-lg font-semibold text-transparent"
					>Select File
				</span>
			</label>
			<input
				onchange={async (e) => {
					$textContent = '';
					$textContentHTML = '';
					$textTitle = 'Untitled_1';
					$progressStore = 0;
					$GLFScore = 0;
					$aiSuggestions = [];
					$replaceStore = [];

					fileDocument = convertInputToFile(e);
					setFileNameDisplay(fileName, fileSuffix);
					await convertToText(fileDocument, fileSuffix);
				}}
				id="File_Drop"
				accept=".pdf,.docx,.png,.jpeg,.jpg"
				type="file"
				class="hidden"
			/>
		</form>
	{:else}
		<ProseMirrorDocu></ProseMirrorDocu>
	{/if}
</div>

<style>
</style>

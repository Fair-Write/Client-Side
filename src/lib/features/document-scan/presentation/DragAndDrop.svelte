<script lang="ts">
	import { CloudUpload, FolderOpen } from 'lucide-svelte';
	import { dragOverHandler } from '../use-case/dragAndDropEvents';
	import { getSuffix } from '$lib/features/document-scan/use-case/utilts';
	import {
		convertDragToFile,
		convertInputToFile
	} from '$lib/features/document-scan/use-case/extractDocument';
	import ProseMirrorDocu from '$lib/features/document-scan/presentation/ProseMirrorDocu.svelte';

	import { toast } from 'svelte-sonner';
	import { textContent } from '$lib/stores/textFromEditorStore';

	let {
		setFileNameDisplay,
		fileDocument
	}: {
		setFileNameDisplay: (name: string, type: 'jpeg' | 'png' | 'docx' | 'pdf' | undefined) => void;
		fileDocument: File | null;
	} = $props();

	$effect(() => {
		if (fileDocument) {
			setFileNameDisplay(fileName, fileSuffix);
			convertToText(fileDocument, fileSuffix);
		}
	});

	let fileSuffix: 'jpeg' | 'png' | 'docx' | 'pdf' | undefined = $derived.by(() => {
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
	let extractedText = $state('');

	async function convertToText(file: File, type: string | undefined) {
		console.log('Converting to file');
		if (!file) {
			throw new Error('EHRM WTF');
		}
		const formData = new FormData();
		formData.append('file', file as File);

		switch (type) {
			case 'docx': {
				console.log('THIS IS DOCX');
				const response = await fetch('/api/extract/docx', { method: 'POST', body: formData });
				const result = await response.json();
				if (result) {
					extractedText = result.data;
					$textContent = result.data;
				}

				break;
			}

			case 'pdf': {
				console.log('THIS IS PDF');
				const response = await fetch('/api/extract/pdf', { method: 'POST', body: formData });
				const result = await response.json();
				console.log(result.data);
				if (result) {
					extractedText = result.data;
					$textContent = result.data;
				}

				break;
			}
			case 'png':
			case 'jpeg': {
				try {
					const response = await fetch('/api/extract/image', { method: 'POST', body: formData });
					const result = await response.json();
					console.log(result);
					extractedText = result.message;
					$textContent = result.message;
				} catch (e) {
					console.log('Error:', e);
					toast.error('An Error Has Occured');
				}

				break;
			}
			case undefined: {
				throw new Error('Affix Undefined');
			}
		}
	}
</script>

<div class="flex w-full flex-1 items-start justify-center lg:items-center">
	{#if extractedText === ''}
		<form
			class=" flex h-[350px] w-[250px] flex-col items-center justify-center
		gap-5 rounded-sm border-2 border-dashed border-stone-300
		bg-stone-50 p-5 lg:h-[450px] lg:w-[450px]"
			ondrop={async (e) => {
				fileDocument = convertDragToFile(e);

				setFileNameDisplay(fileName, fileSuffix);
				await convertToText(fileDocument, fileSuffix);
			}}
			ondragover={(e) => dragOverHandler(e)}
		>
			<FolderOpen class="h-24 w-24 text-stone-500 lg:h-[150px] lg:w-[150px]"></FolderOpen>
			<h3 class="text-center text-lg text-stone-500">Drag your PDF/DOCX/JPG File Here <br /> OR</h3>
			<label
				class="flex items-center justify-center gap-2 rounded-full border border-solid
			border-sky-700 bg-blue-500 bg-gradient-to-b from-sky-300 to-sky-600 px-5 py-2
			text-blue-50 shadow-lg hover:cursor-pointer"
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
					fileDocument = convertInputToFile(e);
					setFileNameDisplay(fileName, fileSuffix);
					await convertToText(fileDocument, fileSuffix);
				}}
				id="File_Drop"
				accept=".pdf,.docx,.png,.jpeg"
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

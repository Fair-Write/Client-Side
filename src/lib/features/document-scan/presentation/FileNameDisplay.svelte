<script lang="ts">
	import { cn } from '$lib/utils';
	import { File, FileImage } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	interface IFileNameDisplay {
		fileName: string | undefined;
		fileType: 'jpeg' | 'png' | 'docx' | 'pdf' | undefined;
	}
	let { fileType, fileName }: IFileNameDisplay = $props();
</script>

{#if fileType !== undefined}
	<div class="flex flex-col items-center justify-center gap-2 mb-5 ">
		<h1 class="font-semibold text-2xl">Selected File</h1>

		<div
			class="flex items-center justify-between gap-5 p-3 border-stone-300 border border-solid rounded-lg shadow-md"
		>
			<!-- change icon based on file type-->
			{#if fileType === 'jpeg' || fileType === 'png'}
				<FileImage class="w-8 h-8"></FileImage>
			{:else if fileType === 'docx' || fileType === 'pdf'}
				<File class="w-10 h-10"></File>
			{/if}

			<p class="text-lg">{fileName}</p>
		</div>
		<Button variant="link" class="text-lg text-stone-500">Move Text To Write Page</Button>
	</div>
{/if}

<script lang="ts">
	import { FolderOpen } from 'lucide-svelte';
	import { dragOverHandler, dropHandler, inputHandler } from '../use-case/dragAndDropEvents';
	import { Input } from '$lib/components/ui/input';
	let fileDocument: null | File = $state(null);
</script>

<div class=" w-[600px] flex-1 flex items-center justify-center p-10">
	<form
		class="w-[350px] h-[350px] border-dashed bg-stone-50 border-stone-300 rounded-sm border-2 flex items-center justify-center gap-5 p-5 flex-col"
		ondrop={async (e) => await dropHandler(e)}
		ondragover={async (e) => await dragOverHandler(e)}
	>
		<FolderOpen class="w-[150px] h-[150px] text-stone-500"></FolderOpen>
		<h3 class="text-lg text-stone-500 text-center">Drag your PDF/DOCX/JPG File Here <br /> OR</h3>

		<label
			class="text-blue-50 px-5 py-3 text-center bg-blue-500 hover:cursor-pointer rounded-full"
			for="File_Drop"
		>
			Choose File
		</label>
		<input
			bind:value={fileDocument}
			onchange={async (e) => await inputHandler(e)}
			id="File_Drop"
			accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			type="file"
			class=" hidden"
		/>
	</form>
</div>

<style>
</style>

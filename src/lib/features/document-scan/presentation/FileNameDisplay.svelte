<script lang="ts">
	import type { IFileNameDisplay } from '$lib/features/document-scan/entities/FileType';
	let { fileType, fileName }: IFileNameDisplay = $props();
</script>

{#if fileType !== undefined}
	<div class="flex items-center justify-center gap-2">
		<!-- change icon based on file type-->
		{#if fileType === 'jpeg' || fileType === 'png'}
			<span
				class=" flex items-center justify-center rounded-[9px] border border-solid border-yellow-500 bg-gradient-to-t from-amber-700 to-yellow-300 p-[1px]"
			>
				<span
					class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-amber-700 to-yellow-500 p-1 text-yellow-50"
				>
					photo_library
				</span>
			</span>
		{:else if fileType === 'docx'}
			<span
				class=" flex items-center justify-center rounded-[9px] border border-solid border-indigo-500 bg-gradient-to-t from-violet-700 to-indigo-300 p-[1px]"
			>
				<span
					class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-violet-700 to-indigo-500 p-1 text-indigo-50"
				>
					description
				</span>
			</span>
		{:else if fileType === 'pdf'}
			<span
				class=" flex items-center justify-center rounded-[9px] border border-solid border-pink-500 bg-gradient-to-t from-rose-700 to-pink-300 p-[1px]"
			>
				<span
					class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-rose-700 to-pink-500 p-1 text-pink-50"
				>
					picture_as_pdf
				</span>
			</span>
		{/if}

		<p
			class="w-20 overflow-hidden overflow-ellipsis whitespace-nowrap text-base font-bold xl:w-auto"
		>
			{fileName}
		</p>
	</div>
{/if}

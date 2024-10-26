<script lang="ts">
	import { dragOverHandler, dropHandler, inputHandler } from '../use-case/dragAndDropEvents';

	let fileDocument: null | File = $state(null);
</script>

<div class="flex-1 w-[700px]">
	<form
		class="scan-container"
		ondrop={async (e) => await dropHandler(e)}
		ondragover={async (e) => await dragOverHandler(e)}
	>
		<div class="drop-wrapper">
			<div>
				<label for="File_Drop">Drag your File Here</label>
				<input
					bind:value={fileDocument}
					onchange={async (e) => await inputHandler(e)}
					id="File_Drop"
					accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					type="file"
				/>
			</div>
		</div>

		<button type="submit">Analyze</button>
	</form>
</div>

<style>
</style>

<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';
	import { progressStore } from '$lib/stores/progressStore';
</script>

<div class="mb-5 flex w-full flex-col items-center justify-start gap-2">
	<div class="relative flex w-full items-center justify-between">
		<span
			class="material-symbols-outlined s26 z-10 rounded-full border-2 border-solid border-blue-500 bg-blue-100 p-2 text-blue-500"
			>edit
		</span>

		<span
			class="material-symbols-outlined s26 z-10 rounded-full border-2 border-solid border-stone-500 bg-stone-100 p-2 text-stone-500"
			>abc
		</span>

		<span
			class="material-symbols-outlined s26 r z-10 rounded-full border-2 border-solid border-stone-500 bg-stone-100 p-2 text-stone-500"
			>manage_search
		</span>

		<Progress value={$progressStore} class="absolute z-0 h-1 text-red-500"></Progress>
	</div>
	<div class=" flex w-full items-center justify-between px-1">
		<p>Write</p>
		<p>Grammar</p>
		<p>GFL</p>
	</div>
</div>

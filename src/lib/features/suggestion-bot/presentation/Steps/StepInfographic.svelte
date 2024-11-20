<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';
	import { progressStore } from '$lib/stores/progressStore';
	import { cn } from '$lib/utils';
</script>

<div class="flex w-full flex-col items-center justify-start gap-2 p-3">
	<div class="relative flex w-full items-center justify-between">
		<span
			class={cn(
				'select-none material-symbols-outlined s26 z-10 rounded-full border-2 border-solid p-2 transition-all ease-in-out',
				$progressStore === 0 && 'border-blue-500 bg-blue-100  text-blue-500',
				$progressStore >= 50 && 'border-blue-500 bg-blue-500  text-blue-50'
			)}
			>edit
		</span>

		<span
			class={cn(
				'select-none material-symbols-outlined s26 z-10 rounded-full border-2 border-solid p-2 transition-all ease-in-out border-stone-500 bg-stone-100  text-stone-500',
				$progressStore === 50 && 'border-blue-500 bg-blue-100  text-blue-500',
				$progressStore === 100 && 'border-blue-500 bg-blue-500  text-blue-50'
			)}
			>abc
		</span>

		<span
			class={cn(
				'select-none material-symbols-outlined s26 z-10 rounded-full border-2 border-solid p-2 transition-all ease-in-out border-stone-500 bg-stone-100 text-stone-500',
				$progressStore === 100 && 'border-blue-500 bg-blue-100  text-blue-500',
				$progressStore === 101 && 'border-blue-500 bg-blue-500  text-blue-50'
			)}
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

<script>
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div
	class="flex h-14 w-full items-center justify-between border-b border-solid border-stone-300 bg-stone-50 px-2"
>
	<div class="flex items-center justify-center gap-2">
		<span class="material-symbols-outlined s40"> history_edu</span>
		<h1 class="hidden font-Leckerli-One text-2xl lg:inline">Fair Write</h1>
		<p class="text-2xl font-light text-neutral-500">Admin</p>
	</div>

	<Button size="icon" class="h-8 w-8">
		<span class="material-symbols-outlined s18"> logout</span>
	</Button>
</div>

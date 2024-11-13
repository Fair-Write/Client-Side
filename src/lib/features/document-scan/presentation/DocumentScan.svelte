<script>
	import DragAndDrop from './DragAndDrop.svelte';
</script>

<!--TODO FIX UI -->
<!-- TODO Integrate the JPG TO Text Feature-->

<div class="flex h-[100svh] min-h-0 w-full flex-col items-center bg-stone-200 lg:flex-1">
	<div
		class=" justify-star flex h-14 w-full items-center border-b border-stone-300 bg-stone-50 p-2"
	>
		<h2 class="text-xl font-semibold">Scan</h2>
	</div>

	<DragAndDrop></DragAndDrop>
</div>

<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
</script>

<!--{#await import('$lib/features/rich-text-editor/presentation/RichTextEditor.svelte')}-->
<section class="flex flex-1 flex-col items-center bg-stone-200">
	<Skeleton class=" w-full h-[55px] rounded-none" />
	<Skeleton
		class="flex-1 w-[700px] rounded-none"
	></Skeleton>
</section>
<!--	>-->
<!--{:then c}-->
<!--	<svelte:component this={c.default} />-->
<!--{/await}-->



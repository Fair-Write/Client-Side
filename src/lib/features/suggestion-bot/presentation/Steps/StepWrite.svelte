<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	let { nextSlide }: { nextSlide: () => Promise<void> } = $props();
	import { textContent } from '$lib/stores/textFromEditorStore';
	import { LoaderCircle } from 'lucide-svelte';

	let isLoading = $state(false);
	async function proceed() {
		isLoading = true;
		await nextSlide();
		isLoading = false;
	}
</script>

<Card.Root class="mx-3 w-full ">
	<Card.Header>
		<Card.Title class="border-b border-dashed border-stone-500 pb-2 font-bold"
			>Step 1: Write</Card.Title
		>
		<Card.Description>Text must be at least 25 words or more to begin.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button
			class="flex  w-full items-center  justify-between border border-blue-500 bg-blue-50 p-3  text-base font-bold text-blue-500 hover:bg-blue-500 hover:text-blue-50"
			disabled={$textContent.trim().split(/\s+/).length < 25 || isLoading}
			variant="outline"
			color="secondary"
			onclick={proceed}

		>
			<p>Proceed</p>
			{#if isLoading}
				<LoaderCircle class="animate-spin" />
			{:else}
				<span class="material-symbols-outlined s16">arrow_forward_ios</span>
			{/if}
		</Button>
	</Card.Content>
</Card.Root>

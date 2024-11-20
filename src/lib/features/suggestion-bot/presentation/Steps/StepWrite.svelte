<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	let { nextSlide }: { nextSlide: () => void } = $props();
	import { progressStore } from '$lib/stores/progressStore';
	import { textContent } from '$lib/stores/textFromEditorStore';
</script>

<Card.Root class="mx-3">
	<Card.Header>
		<Card.Title class="border-b border-dashed border-stone-500 pb-2 font-bold"
			>Step 1: Write</Card.Title
		>
		<Card.Description>Text must be at least 25 words or more to begin.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button
			size="lg"
			disabled={$textContent.trim().split(/\s+/).length < 25}
			variant="outline"
			color="secondary"
			class="w-full"
			onclick={() => {
				nextSlide();
				$progressStore = 50;
			}}
			>Proceed
			<span class="material-symbols-outlined s16">arrow_forward_ios</span>
		</Button>
	</Card.Content>
</Card.Root>

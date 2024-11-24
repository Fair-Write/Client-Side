<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	let { nextSlide }: { nextSlide: () => void } = $props();
	import { progressStore } from '$lib/stores/progressStore';
	import { textContent } from '$lib/stores/textFromEditorStore';
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

			class="w-full  flex items-center  justify-between border border-blue-500 bg-blue-50 p-3  text-base font-bold text-blue-500 hover:bg-blue-500 hover:text-blue-50"
			disabled={$textContent.trim().split(/\s+/).length < 25}
			variant="outline"
			color="secondary"
			onclick={() => {
				nextSlide();
				$progressStore = 50;
			}}
			>
			<p>Proceed</p>
			<span class="material-symbols-outlined s16">arrow_forward_ios</span>
		</Button>
	</Card.Content>
</Card.Root>

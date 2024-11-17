<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	let { nextSlide }: { nextSlide: () => void } = $props();
	import {progressStore} from '$lib/stores/progressStore';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="border-b border-dashed border-stone-500 pb-2 font-bold"
			>Step 1: Write</Card.Title
		>
		<Card.Description>Text must be at least 25 words or more to begin.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button size="lg" onclick={()=>{
			nextSlide();
			$progressStore = 50;
		}}>Proceed</Button>
	</Card.Content>
</Card.Root>

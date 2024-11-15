<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="font-bold border-b border-dashed border-stone-500 pb-2">Step 1: Write</Card.Title>
		<Card.Description>Text must be at least 25 words or more to begin.</Card.Description>
	</Card.Header>
	<Card.Content>
	<Button size="lg"> Proceed </Button>
	</Card.Content>

</Card.Root>

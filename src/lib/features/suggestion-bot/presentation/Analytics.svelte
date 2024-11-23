<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
	import Gauge from '$lib/features/suggestion-bot/presentation/Steps/Gauge.svelte';
</script>

<div class="w-full flex items-center justify-stretch gap-2 flex-col  ">
	<Gauge radius={100} percent={90}></Gauge>

	<Card.Root>
		<Card.Header>
			<Card.Title class="border-b border-dashed border-stone-500 pb-2 text-lg font-bold "
				>Useful Articles:</Card.Title
			>
		</Card.Header>
		<Card.Content class="text-base text-blue-500">
			<ul class="list-outside list-disc px-3">
				<li class="hover:underline">
					<a target="_blank" href="https://www.google.com" rel="noopener noreferrer"
						>How we detect gender fair language</a
					>
				</li>
				<li class="mt-2 hover:underline">
					<a target="_blank" href="https://www.google.com" rel="noopener noreferrer"
						>What is gender fair language</a
					>
				</li>
			</ul>
		</Card.Content>
	</Card.Root>
	<Button>Start All Over Again</Button>
	<Button>Export As</Button>
</div>

<style>
</style>

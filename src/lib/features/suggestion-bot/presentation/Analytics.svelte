<script lang="ts">

	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from '$lib/components/ui/button';

</script>

<div class="container">
	<div class="gauge-a"></div>
	<div class="gauge-b"></div>
	<div class="gauge-c"></div>
	<div class="gauge-data">
		<h1 id="percent">0%</h1>
	</div>

</div>


<Card.Root>
	<Card.Header>
		<Card.Title>Useful Articles</Card.Title>
	</Card.Header>
	<Card.Content>
		<a target="_blank" href="www.google.com">how we detect gender fair language</a>
		<a target="_blank" href="www.google.com">What is gender fair language</a>
	</Card.Content>

</Card.Root>
<Button>Start All Over Again</Button>
<Button>Export As</Button>


<style >

</style>
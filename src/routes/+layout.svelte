<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { Toaster } from '$lib/components/ui/sonner/index.js';
</script>
<Toaster richColors position="top-center"></Toaster>
{@render children()}

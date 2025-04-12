<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { beforeNavigate, goto } from '$app/navigation';
	import { textContent, textContentHTML } from '$lib/stores/textFromEditorStore';
	import { progressStore } from '$lib/stores/progressStore';

	beforeNavigate(({ to, cancel }) => {
		if (!confirm('Are you sure you want to change navigation? Any unsaved changes will be lost')) {
			return cancel();
		} else {
			const route = to?.route || '';
			// this shit might backfire but who the fuck cares
			$textContent = '';
			$textContentHTML = '';
			$progressStore = 0;
			goto(to?.route.id ?? 'NOT POOP');
		}
	});
</script>

<Toaster richColors position="top-center"></Toaster>
{@render children()}

<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { beforeNavigate } from '$app/navigation';
	import { textContent, textContentHTML, textTitle } from '$lib/stores/textFromEditorStore';
	import { progressStore } from '$lib/stores/progressStore';
	import { GLFScore } from '$lib/stores/omegaLOL';

	beforeNavigate(({ cancel }) => {
		if ($textContent == '') return;
		const confirmed = confirm('Are you sure you want to leave this page?');
		if (!confirmed) {
			cancel(); // cancels the navigation, including back button
		} else {
			$textContent = '';
			$textContentHTML = '';
			$textTitle = 'Untitled_1';
			$progressStore = 0;
			$GLFScore = 0;
			return;
		}
	});
</script>

<Toaster richColors position="top-center"></Toaster>
{@render children()}

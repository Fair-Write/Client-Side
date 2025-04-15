<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { beforeNavigate, goto } from '$app/navigation';
	import { textContent, textContentHTML, textTitle } from '$lib/stores/textFromEditorStore';
	import { progressStore } from '$lib/stores/progressStore';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	let trigger = $state(false);
	let route = $state('');
	let changeRoute = $state(false);
	beforeNavigate(({ to, cancel }) => {
		if (changeRoute) {
			goto(route);
			trigger = false;
			changeRoute = false;
		} else {
			cancel();
			trigger = true;
			route = to?.route.id || '';
		}
	});
	function confirmNavigation() {
		$textContent = '';
		$textContentHTML = '';
		$progressStore = 0;
		$textTitle = 'Untitled_1';
		trigger = false;
		changeRoute = true;
		goto(route);
	}
</script>

<AlertDialog.Root open={trigger}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm Navigation: Unsaved Changes Will Be Lost</AlertDialog.Title>
			<AlertDialog.Description>
				You are about to navigate away from this page. Any unsaved changes will be lost, and your
				current document will be reset. Are you sure you want to proceed?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={() => (trigger = false)}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={() => {
					confirmNavigation();
					trigger = false;
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
<Toaster richColors position="top-center"></Toaster>
{@render children()}

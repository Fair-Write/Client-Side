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
	// this is stupid this could've been easier if i just
	// used the confirm webapi of the browser then
	// we would not have been in this situation
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
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
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

<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import SuggestionTab from '$lib/features/suggestion-bot/presentation/SuggestionTab.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { onMount } from 'svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	const burger = [
		{ description: 'Write down your text', url: '/write.png', title: 'Write' },
		{ description: 'Check For Grammar Issues', url: '/grammar.png', title: 'Grammar' },
		{
			description: 'Proceed With Gender Fairness Detection',
			url: '/gfl.png',
			title: 'Gender Fair Langauge Detection'
		},
		{ description: 'See Your Results!', url: '/review.png', title: 'Review' }
	];

	const commands = [
		{
			name: 'Undo',
			keymap: 'Ctrl+z'
		},
		{
			name: 'Redo',
			keymap: 'Ctrl+y'
		},
		{
			name: 'Redo',
			keymap: 'Ctrl+Shift+z'
		},
		{
			name: 'Toggle Bold',
			keymap: 'Ctrl+b'
		},
		{
			name: 'Toggle Italic',
			keymap: 'Ctrl+i'
		},
		{
			name: 'New List Item',
			keymap: 'Ctrl+Enter'
		},
		{
			name: 'New Line',
			keymap: 'Enter'
		}
	];

	let acceptPolicies = $state(false);

	onMount(() => {
		if (!localStorage.getItem('Accept')) {
			localStorage.setItem('Accept', 'false');
			return;
		}
		acceptPolicies = JSON.parse(localStorage.getItem('Accept') as string);
	});
</script>

<div class="flex flex-1 bg-stone-100">
	<div
		class="flex flex-col justify-between gap-2 border-r border-solid border-stone-300 sm:w-auto md:w-48 2xl:w-64"
	>
		<!-- wrapper -->

		<div class="flex flex-col gap-1 *:px-2">
			<div
				class="flex h-14 items-center justify-center gap-2 border-b border-solid border-stone-300 bg-stone-50 lg:justify-start"
			>
				<span class="material-symbols-outlined s40"> history_edu</span>
				<h1 class="hidden font-Leckerli-One text-2xl lg:inline">Fair Write</h1>
			</div>

			<div class="mb-5 hidden border-b border-dashed border-stone-400 px-3 py-2 lg:inline">
				<h3 class=" text-xl font-semibold text-stone-400">Features</h3>
			</div>
			<!-- editor and scan -->
			<nav class="flex flex-col gap-2 *:px-2">
				<a
					href="/dashboard/editor"
					class={cn(
						'flex items-center justify-start gap-2  rounded-lg border border-transparent p-2 text-xl transition-all ease-in-out',
						' hover:bg-stone-200 ',
						$page.url.pathname === '/dashboard/editor' &&
							'border-solid border-stone-300 bg-stone-50 shadow-md hover:bg-stone-50'
					)}
				>
					<!--stupid icon-->
					<span
						class=" flex items-center justify-center rounded-[9px] border border-solid border-green-500 bg-gradient-to-t from-emerald-700 to-green-300 p-[1px]"
					>
						<span
							class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-emerald-700 to-green-500 p-1 text-green-50"
						>
							edit_document</span
						></span
					>

					<span class="hidden lg:inline">Editor</span>
				</a>

				<a
					href="/dashboard/scan"
					class={cn(
						'flex items-center justify-start gap-2 rounded-lg border border-transparent  p-2 text-xl    transition-all ease-in-out',
						' hover:bg-stone-200 ',
						$page.url.pathname === '/dashboard/scan' &&
							'border-solid border-stone-300 bg-stone-50 shadow-md hover:bg-stone-50 '
					)}
				>
					<!--stupid icon-->
					<span
						class=" flex items-center justify-center rounded-[9px] border border-solid border-sky-500 bg-gradient-to-t from-blue-700 to-sky-300 p-[1px]"
					>
						<span
							class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-blue-700 to-sky-500 p-1 text-sky-50"
						>
							scan</span
						></span
					>
					<span class=" hidden lg:inline">Scan</span>
				</a>
			</nav>
		</div>

		<div class="flex flex-col gap-1 border border-solid border-t-stone-300">
			<Dialog.Root>
				<Dialog.Trigger>
					<div class="flex items-center justify-center gap-2 p-2 text-xl lg:justify-start">
						<!--stupid icon-->
						<span
							class=" flex items-center justify-center rounded-[9px] border border-solid border-fuchsia-500 bg-gradient-to-t from-neutral-700 to-pink-300 p-[1px]"
						>
							<span
								class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-fuchsia-700 to-pink-500 p-1 text-pink-50"
							>
								keyboard_command_key</span
							></span
						>

						<span class="hidden lg:inline">Commands</span>
					</div>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Command Shortcuts</Dialog.Title>
						<Dialog.Description>
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head class="w-[100px]">Name</Table.Head>
										<Table.Head class="text-right">Command</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each commands as command}
										<Table.Row>
											<Table.Cell class="font-medium">{command.name}</Table.Cell>

											<Table.Cell class="text-right">{command.keymap}</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root></Dialog.Description
						>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>

			<Dialog.Root>
				<Dialog.Trigger>
					<div class="flex items-center justify-center gap-2 p-2 text-xl lg:justify-start">
						<!--stupid icon-->
						<span
							class=" flex items-center justify-center rounded-[9px] border border-solid border-amber-500 bg-gradient-to-t from-orange-700 to-yellow-300 p-[1px]"
						>
							<span
								class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-orange-700 to-yellow-500 p-1 text-yellow-50"
							>
								volunteer_activism</span
							></span
						>

						<span class="hidden lg:inline">Help</span>
					</div>
				</Dialog.Trigger>
				<Dialog.Content
					class="flex items-center justify-center lg:max-w-[500px] 2xl:max-w-[700px] "
				>
					<Carousel.Root class="h-[500px] max-w-[400px] lg:max-w-[500px] 2xl:max-w-[700px]">
						<Carousel.Content>
							{#each burger as _, i (i)}
								<Carousel.Item>
									<p class="mb-1 text-2xl font-semibold">Step {i + 1}:{_.title}</p>
									<p class="mb-1 text-base">{_.description}</p>
									<img alt="" class="mt-1" src={_.url} />
								</Carousel.Item>
							{/each}
							<!--  -->
						</Carousel.Content>
						<Carousel.Previous class="h-16 w-16" />
						<Carousel.Next class="h-16 w-16" />
					</Carousel.Root>
				</Dialog.Content>
			</Dialog.Root>

			<Dialog.Root>
				<Dialog.Trigger>
					<div class="flex items-center justify-center gap-2 p-2 text-xl lg:justify-start">
						<!--stupid icon-->
						<span
							class=" flex items-center justify-center rounded-[9px] border border-solid border-stone-500 bg-gradient-to-t from-neutral-700 to-stone-300 p-[1px]"
						>
							<span
								class="material-symbols-outlined s26 rounded-[8px] bg-gradient-to-t from-neutral-700 to-stone-500 p-1 text-stone-50"
							>
								info</span
							></span
						>

						<span class="hidden lg:inline">Info</span>
					</div>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>What's Fair Write?</Dialog.Title>
						<Dialog.Description>
							&nbsp; Fair Write, a web-based text editing application integrated with gender-fair
							language capabilities. Fair Write provides suggestions and corrections to help users
							avoid biased or gender-exclusive terms in their writing. Whether drafting professional
							documents, academic papers, or casual content,
							<br />
							<br />
							&nbsp; Its integrated features include intelligent grammar checking, inclusive vocabulary
							alternatives, and style recommendations aligned with current gender-sensitive language
							standards. Fair Write is an essential tool for individuals and organizations striving for
							more conscious and inclusive communication.
						</Dialog.Description>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>
		</div>

		{#if !acceptPolicies}
			<AlertDialog.Root open={true}>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Welcome To Fair Write!</AlertDialog.Title>
						<AlertDialog.Description>
							<p class="pb-1 text-sm">
								By Clicking "Continue", you agree to allow Fair Write to temporarily process any
								documents or text you create or upload in order to analyze them for errors or
								suggestions.You also acknowledge and support our commitment to promoting gender
								fairness, and consent to the use of inclusive language checks as part of the
								analysis.
							</p>
							<p class="py-1 text-sm">Key Points:</p>
							<ul class="list-inside list-disc text-sm *:py-1">
								<li>We do not store or permanently save your documents or text.</li>
								<li>
									All content is processed in memory solely for the purpose of providing feedback
									and improving your writing experience.
								</li>
								<li>
									You retain full ownership of your content at all times. We do not use your content
									for any other purpose beyond real-time analysis.
								</li>
							</ul>
							<p class="pt-1 text-sm">
								If you do not agree with these terms, please do not use the content analysis
								features of the application.
							</p>
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Action
							onclick={() => {
								acceptPolicies = !acceptPolicies;
								localStorage.setItem('Accept', 'true');
							}}>Continue</AlertDialog.Action
						>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>{/if}
	</div>
	<main class=" flex flex-1 shrink-0 basis-0 flex-col bg-stone-200 lg:flex-row">
		<slot></slot>
		<SuggestionTab></SuggestionTab>
	</main>
</div>

<script lang="ts">
	import { onMount } from 'svelte';

	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { DOMParser, DOMSerializer } from 'prosemirror-model';
	import { history, closeHistory } from 'prosemirror-history';

	import { textContent, textContentHTML, textTitle } from '$lib/stores/textFromEditorStore';
	import mySchema from '$lib/features/rich-text-editor/entities/Schema';

	import ToolBar from './ToolBar.svelte';
	// import ExportButton from './ExportButton.svelte';
	import createLinterPlugin from '../use-case/LinterPlugin';
	import { extendedKeyMap, myKeymap } from '$lib/features/rich-text-editor/entities/keymaps';
	import { placeholder } from '$lib/features/rich-text-editor/use-case/PlaceHolderPlugin';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap } from 'prosemirror-commands';
	import { Transaction } from 'prosemirror-state';
	import { replaceWordInDocument } from '$lib/features/rich-text-editor/use-case/replaceText';
	import { aiSuggestions } from '$lib/stores/lintingStore';
	import { replaceStore } from '$lib/stores/lintingStore';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
	import { cn } from '$lib/utils';
	import { progressStore } from '$lib/stores/progressStore';
	import { toast } from 'svelte-sonner';
	import { signalTextEditor } from '$lib/stores/signalStore';
	import { buildInputRules } from '$lib/features/document-scan/use-case/inputRules';
	import { cleanPastePlugin } from '../use-case/cleanPastePlugin';
	import { driver } from 'driver.js';

	import { tourStore } from '$lib/stores/tourStore';

	let editorContainer: HTMLDivElement | null = $state(null);
	let view: EditorView | null = $state(null);
	let linterPlugin = createLinterPlugin([]);

	function resetScroll(event: Event) {
		const target = event.target as HTMLDivElement;
		target.scrollLeft = 0;
	}

	// a shitty solution for a big problem but who cares
	$effect(() => {
		if ($signalTextEditor === true) {
			if (view == null) return;
			reinitializeText(view as EditorView);
			$signalTextEditor = false;
		}
	});

	// when stores has changed, the plugins must be reconfigured
	function reinitializeText(view: EditorView) {
		const node = view.state.schema.text($textContent);
		const tr = view.state.tr.replaceWith(0, view.state.doc.content.size, node);
		view.dispatch(tr);
	}

	// when stores has changed, the plugins must be reconfigured
	function reconfigureAllPlugins(): void {
		if (view != null) {
			linterPlugin = createLinterPlugin($aiSuggestions);
			const state = view.state.reconfigure({
				plugins: [
					linterPlugin,
					history(),
					extendedKeyMap,
					keymap(baseKeymap),
					myKeymap,
					placeholder('Type your text here'),
					buildInputRules(mySchema),
					cleanPastePlugin
				]
			});

			view.updateState(state);
		}
	}

	$effect(() => {
		if (aiSuggestions) {
			reconfigureAllPlugins();
		}
	});

	function resetHistory() {
		if (view != null) {
			// Use a transaction to close the current history and start a new one
			const tr = view.state.tr;
			closeHistory(tr); // Ends the current history session
			view.dispatch(tr);
		}
	}

	function replaceWordCommand(words: TSuggestion) {
		return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
			if (!dispatch) return false; // No dispatch means no transaction to apply

			replaceWordInDocument(state, dispatch, words);
			return true; // Return true to indicate that the command executed
		};
	}

	$effect(() => {
		if ($replaceStore.length != 0) {
			$replaceStore.forEach((store) => {
				replaceWordCommand(store)(view!.state, view!.dispatch);
			});

			$replaceStore = [];
			resetHistory();
			reconfigureAllPlugins();
		}
	});

	const driverObj = driver({
		showProgress: true,
		allowClose: false,
		steps: [
			{
				element: '.step-1',
				popover: { title: 'Navigation', description: 'This is where you navigate between pages' }
			},
			{
				element: '.step-2',
				popover: { title: 'Editor', description: 'This is were you write your document!' }
			},
			{
				element: '.step-3',
				popover: {
					title: 'Toolbar',
					description: 'This is the toolbar where you can edit your text with styles!'
				}
			},
			{
				element: '.step-4',
				popover: {
					title: 'Suggestion Tab',
					description: 'This tab contains the AI Suggestions and Preference settings'
				}
			},
			{
				element: '.step-5',
				popover: {
					title: 'Preferred Pronouns',
					description:
						'If you have any people in the document that have preferred pronouns you can add their names here'
				}
			},
			{
				element: '.step-6',
				popover: {
					title: 'Submit',
					description:
						'After writing your document, you can begin scanning for inappropriate use of gender fair langauge'
				}
			},
			{
				element: '.step-7',
				popover: {
					title: 'Added Info',
					description: 'For more information please visit these links!'
				}
			}
		]
	});

	$effect(() => {
		// if localstorage exists then just destroy it
		if (localStorage.getItem('tourScan1')) {
			driverObj.destroy();
			return;
		}
		if ($tourStore) {
			localStorage.setItem('tourScan1', 'Poop');
			driverObj.drive();
		} else {
			driverObj.destroy();
		}
	});

	onMount(() => {
		const state = EditorState.create({
			schema: mySchema,
			doc: DOMParser.fromSchema(mySchema).parse(
				document.createRange().createContextualFragment($textContentHTML)
			),
			plugins: [
				history(),
				extendedKeyMap,
				keymap(baseKeymap),
				myKeymap,
				placeholder('Type your text here'),
				linterPlugin,
				buildInputRules(mySchema),
				cleanPastePlugin
			]
		});

		view = new EditorView(editorContainer, {
			state,
			dispatchTransaction(transaction) {
				const newState = view!.state.apply(transaction);
				view!.updateState(newState);
				$textContent = newState.doc.textContent.toString();
				const fragment = DOMSerializer.fromSchema(mySchema).serializeFragment(newState.doc.content);
				const div = document.createElement('div');
				div.appendChild(fragment);
				$textContentHTML = div.innerHTML;
			}
		});
		reconfigureAllPlugins();

		return () => {
			view?.destroy();
		};
	});
</script>

<section class="flex min-h-[100svh] flex-1 flex-col items-center bg-stone-50 xl:h-full">
	<!-- Custom toolbar with Chadcn Svelte buttons -->
	<div
		class="step-3 flex h-14 max-h-14 w-full items-center justify-between border-b border-stone-300 bg-stone-50 p-2"
	>
		<input
			type="text"
			class="w-24 text-ellipsis whitespace-nowrap bg-stone-50 text-xl font-semibold focus:outline-none"
			bind:value={$textTitle}
			onblur={resetScroll}
		/>
		{#if view !== null}
			<ToolBar {view} {mySchema}></ToolBar>
		{/if}

		<div>
			<p class="text-xs text-muted-foreground lg:text-sm">
				Count: {$textContent == '' ? 0 : $textContent.trim().split(/\s+/).length}
			</p>
		</div>
	</div>

	<!-- ProseMirror editor container -->

	<ScrollArea
		class="step-2 max-h-[400px] w-full flex-1 shadow-inner lg:max-h-[600px] xl:max-h-[800px]"
		onclick={() => {
			if ($progressStore > 0) {
				toast.info('You can only edit text during the Write Step');
			}
		}}
	>
		<div class="flex h-full w-full items-start justify-center">
			<div
				bind:this={editorContainer}
				class={cn(
					'editor__paragraph prose prose-sm w-full flex-1 text-stone-800 lg:prose-base xl:prose-lg',
					$progressStore > 0 && 'pointer-events-none'
				)}
				id="editor"
			></div>
		</div>
	</ScrollArea>
</section>

<style>
	#editor {
		padding: 10px 10px;
		width: 100%;
		max-width: 900px; /* Optional: prevent overflow */
		/*background: antiquewhite;*/
	}
</style>

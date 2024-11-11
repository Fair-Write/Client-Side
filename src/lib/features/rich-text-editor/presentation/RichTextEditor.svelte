<script lang="ts">
	import { onMount } from 'svelte';

	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { DOMParser } from 'prosemirror-model';
	import { history } from 'prosemirror-history';

	import { textContent } from '$lib/stores/textFromEditorStore';
	import mySchema from '$lib/features/rich-text-editor/entities/Schema';

	import ToolBar from './ToolBar.svelte';
	// import ExportButton from './ExportButton.svelte';
	import createLinterPlugin from '../use-case/LinterPlugin';
	import { myKeymap } from '$lib/features/rich-text-editor/entities/keymaps';
	import { placeholder } from '$lib/features/rich-text-editor/use-case/PlaceHolderPlugin';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap } from 'prosemirror-commands';
	import { Transaction } from 'prosemirror-state';
	import { replaceWordInDocument } from '$lib/features/rich-text-editor/use-case/replaceText';
	import { linterStore } from '$lib/stores/lintingStore';
	import { replaceStore } from '$lib/stores/lintingStore';

	let editorContainer: HTMLDivElement | null = $state(null);
	let view: EditorView | null = $state(null);
	let linterPlugin = createLinterPlugin([]);

	// todo:LINTER - add a store for this array of regexes i also have to have a regex factory
	// todo:LINTER - create a linter will be instantiated easily DONE
	// todo:REPLACE TEXT - add a store as well for the word to replace it with

	// Plan: bali when changing these arrays i must instantiate the plugin again sadly

	function reconfigAllPlugins(): void {
		if (!view) throw new Error('Editorview not defined');

		linterPlugin = createLinterPlugin($linterStore);

		const state = view.state.reconfigure({
			plugins: [
				linterPlugin,
				history(),
				keymap(baseKeymap),
				myKeymap,
				placeholder('Type your text here')
			]
		});

		view.updateState(state);
	}

	function replaceWordCommand(words: { correctPhrase: string; wrongPhrase: string }) {
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
		}
	});

	onMount(() => {
		const state = EditorState.create({
			schema: mySchema,
			doc: DOMParser.fromSchema(mySchema).parse(
				document.createRange().createContextualFragment($textContent)
			),
			plugins: [
				history(),
				keymap(baseKeymap),
				myKeymap,
				placeholder('Type your text here'),
				linterPlugin
			]
		});

		view = new EditorView(editorContainer, {
			state,
			dispatchTransaction(transaction) {
				const newState = view!.state.apply(transaction);
				view!.updateState(newState);
				$textContent = newState.doc.textContent.toString();
			}
		});
		reconfigAllPlugins();

		return () => {
			view?.destroy();
		};
	});
</script>

<section class="flex flex-1 flex-col items-center bg-stone-200">
	<!-- Custom toolbar with Chadcn Svelte buttons -->
	<div
		class=" flex h-14 w-full items-center justify-between border-b border-stone-300 bg-stone-50 p-2"
	>
		<h2 class="text-xl font-semibold">Editor</h2>

		{#if view!==null}
		<ToolBar {view} {mySchema}></ToolBar>
			{/if}

		<div>
			Word Count: {$textContent.trim().split(/\s+/).length}
		</div>

	</div>

	<!-- ProseMirror editor container -->
	<div
		bind:this={editorContainer}
		class="prose overflow-y-scroll w-[700px] prose-base flex-1 bg-stone-50 focus:outline-none editor__paragraph"
		id="editor"
	></div>
</section>

<style>
	#editor {
		padding: 10px 20px;
	}
</style>

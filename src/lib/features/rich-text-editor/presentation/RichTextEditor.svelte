<script lang="ts">
	import { onMount } from 'svelte';

	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { DOMParser } from 'prosemirror-model';
	import { history } from 'prosemirror-history';

	import { textContent } from '$lib/stores/textFromEditorStore';
	import mySchema from '$lib/features/rich-text-editor/entities/Schema';

	import ToolBar from './ToolBar.svelte';
	import ExportButton from './ExportButton.svelte';
	import createLinterPlugin from '../use-case/LinterPlugin';
	import { myKeymap } from '$lib/features/rich-text-editor/entities/keymaps';
	import { placeholder } from '$lib/features/rich-text-editor/use-case/PlaceHolderPlugin';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap } from 'prosemirror-commands';
	import { Transaction } from 'prosemirror-state';
	import { replaceWordInDocument } from '$lib/features/rich-text-editor/use-case/replaceText';

	let editorContainer: HTMLDivElement | null = $state(null);
	let view: EditorView | null = $state(null);

	const words = { wrongWord: 'svelte', rightWord: 'vue' };
	const linterPlugin = createLinterPlugin([/burger/g, /pizza/g, /fries/g]);

	function replaceWordCommand(words: { wrongWord: string; rightWord: string }) {
		return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
			if (!dispatch) return false; // No dispatch means no transaction to apply

			replaceWordInDocument(state, dispatch, words);
			return true; // Return true to indicate that the command executed
		};
	}
	onMount(() => {
		const state = EditorState.create({
			schema: mySchema,
			doc: DOMParser.fromSchema(mySchema).parse(
				document.createRange().createContextualFragment($textContent)
			),
			plugins: [
				history(),
				linterPlugin,
				keymap(baseKeymap),
				myKeymap,
				placeholder('Type your text here')
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
		<h2 class="text-xl font-semibold">Write</h2>

		{#if view !== null}
			<ToolBar {view} {mySchema}></ToolBar>
			<ExportButton state={view.state}></ExportButton>
			<button
				onclick={() => {
					if (!view) {
						throw new Error('view is null');
					}
					replaceWordCommand(words)(view.state, view.dispatch);
				}}
			>
				Click
			</button>
		{/if}
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

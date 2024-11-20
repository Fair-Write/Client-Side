<script lang="ts">
	import { onMount } from 'svelte';

	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { DOMParser } from 'prosemirror-model';

	import { textContent, textTitle } from '$lib/stores/textFromEditorStore';
	import mySchema from '$lib/features/rich-text-editor/entities/Schema';

	import createLinterPlugin from '$lib/features/rich-text-editor/use-case/LinterPlugin';
	import { Transaction } from 'prosemirror-state';
	import { replaceWordInDocument } from '$lib/features/rich-text-editor/use-case/replaceText';
	import { aiSuggestions, omitObject, replaceStore } from '$lib/stores/lintingStore';

	let editorContainer: HTMLDivElement | null = $state(null);
	let view: EditorView | null = $state(null);
	let linterPlugin = createLinterPlugin([]);

	let { text }: { text: string | null } = $props();

	// when stores has changed, the plugins must be reconfigured
	function reconfigureAllPlugins(): void {
		if (!view) throw new Error('Editorview not defined');

		linterPlugin = createLinterPlugin(	$aiSuggestions.map((aiSuggestion) =>
			omitObject(aiSuggestion, 'correctPhrase', 'analysis', 'heading', 'rationale')
		));

		const state = view.state.reconfigure({
			plugins: [linterPlugin]
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
	// Function to replace the text inside the editor
	function replaceEditorText(newText: string, view: EditorView) {
		const { tr } = view.state;

		// Create a new paragraph node with the new text
		const newNode = mySchema.nodes.paragraph.create(null, mySchema.text(newText));

		// Replace the entire document content with the new node
		const transaction = tr.replaceWith(0, view.state.doc.content.size, newNode);
		view.dispatch(transaction);
	}
	$effect(() => {
		if (aiSuggestions) {
			if (view != null) reconfigureAllPlugins();
		}
	});


	$effect(() => {
		if ($replaceStore.length != 0) {
			$replaceStore.forEach((store) => {
				replaceWordCommand(store)(view!.state, view!.dispatch);
			});

			$replaceStore = [];
		}
	});

	$effect(() => {
		$textContent = text as string;
		if( view !==null) replaceEditorText($textContent, view as EditorView);
	});

	onMount(() => {
		$textContent = text as string;
		const state = EditorState.create({
			schema: mySchema,
			doc: DOMParser.fromSchema(mySchema).parse(
				document.createRange().createContextualFragment($textContent)
			),
			plugins: [linterPlugin]
		});

		view = new EditorView(editorContainer, {
			editable: () => false,
			state,
			dispatchTransaction(transaction) {
				const newState = view!.state.apply(transaction);
				view!.updateState(newState);
				$textContent = newState.doc.textContent.toString();
			}
		});
		reconfigureAllPlugins();

		return () => {
			view?.destroy();
		};
	});
</script>

<div class="custom-shadow flex w-full h-full flex-1 items-start justify-center bg-stone-50">
	<div
		bind:this={editorContainer}
		class="editor__paragraph prose prose-sm flex-1 lg:prose-base xl:prose-lg"
		id="editor"
	></div>
</div>

<!--</section>-->

<style>
	#editor {
		padding: 10px 10px;
		width: 100%;
		max-width: 900px; /* Optional: prevent overflow */
	}
	.custom-shadow {
		box-shadow: inset 0 0 3px 3px rgb(0 0 0 / 0.05);
	}
</style>

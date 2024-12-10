<script lang="ts">
	import { onMount } from 'svelte';

	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { DOMParser } from 'prosemirror-model';

	import { textContent, textContentHTML } from '$lib/stores/textFromEditorStore';
	import mySchema from '$lib/features/rich-text-editor/entities/Schema';

	import createLinterPlugin from '$lib/features/rich-text-editor/use-case/LinterPlugin';
	import { myKeymap } from '$lib/features/rich-text-editor/entities/keymaps';
	import { placeholder } from '$lib/features/rich-text-editor/use-case/PlaceHolderPlugin';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap } from 'prosemirror-commands';
	import { Transaction } from 'prosemirror-state';
	import { replaceWordInDocument } from '$lib/features/rich-text-editor/use-case/replaceText';
	import { aiSuggestions } from '$lib/stores/lintingStore';
	import { replaceStore } from '$lib/stores/lintingStore';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

	let editorContainer: HTMLDivElement | null = $state(null);
	let view: EditorView | null = $state(null);
	let linterPlugin = createLinterPlugin([]);

	// when stores has changed, the plugins must be reconfigured
	function reconfigureAllPlugins(): void {
		if (!view) throw new Error('Editorview not defined');

		linterPlugin = createLinterPlugin($aiSuggestions);

		const state = view.state.reconfigure({
			plugins: [linterPlugin, keymap(baseKeymap), myKeymap, placeholder('Type your text here')]
		});

		view.updateState(state);
	}

	$effect(() => {
		if (aiSuggestions) {
			if (view != null) reconfigureAllPlugins();
		}
	});

	function replaceWordCommand(words:TSuggestion) {
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
			plugins: [keymap(baseKeymap), myKeymap, placeholder('Type your text here'), linterPlugin]
		});

		view = new EditorView(editorContainer, {
			state,
			dispatchTransaction(transaction) {
				const newState = view!.state.apply(transaction);
				view!.updateState(newState);
				$textContent = newState.doc.textContent.toString();
				$textContentHTML = newState.doc.textContent;
			}
		});
		reconfigureAllPlugins();

		return () => {
			view?.destroy();
		};
	});
</script>

<div class="flex flex-1 flex-col items-center bg-stone-50 xl:h-full">
	<ScrollArea class="max-h-[400px] w-full flex-1 shadow-inner lg:max-h-[600px] xl:max-h-[800px]">
		<div class="flex h-full w-full items-start justify-center">
			<div
				bind:this={editorContainer}
				class="editor__paragraph prose prose-sm w-full flex-1 lg:prose-base xl:prose-lg text-stone-800"
				id="editor"
			></div>
		</div>
	</ScrollArea>
</div>

<style>
	#editor {
		padding: 10px 10px;
		width: 100%;
		max-width: 900px; /* Optional: prevent overflow */
		/*background: antiquewhite;*/
	}
</style>

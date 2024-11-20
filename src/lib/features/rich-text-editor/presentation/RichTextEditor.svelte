<script lang="ts">
	import { onMount } from 'svelte';

	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { DOMParser } from 'prosemirror-model';
	import { history } from 'prosemirror-history';

	import { textContent, textTitle } from '$lib/stores/textFromEditorStore';
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
	import { aiSuggestions, omitObject } from '$lib/stores/lintingStore';
	import { replaceStore } from '$lib/stores/lintingStore';

	let editorContainer: HTMLDivElement | null = $state(null);
	let view: EditorView | null = $state(null);
	let linterPlugin = createLinterPlugin([]);

	function resetScroll(event: Event) {
		const target = event.target as HTMLDivElement;
		target.scrollLeft = 0;
	}

	// when stores has changed, the plugins must be reconfigured
	function reconfigureAllPlugins(): void {
		if (!view) throw new Error('Editorview not defined');

		linterPlugin = createLinterPlugin(
			$aiSuggestions.map((aiSuggestion) =>
				omitObject(aiSuggestion, 'correctPhrase', 'analysis', 'heading')
			)
		);

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

	$effect(() => {
		if (aiSuggestions) {
			if (view != null) reconfigureAllPlugins();
		}
	});

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
		reconfigureAllPlugins();

		return () => {
			view?.destroy();
		};
	});
</script>

<section class="flex min-h-[100svh] flex-1 flex-col items-center bg-stone-50 xl:h-full">
	<!-- Custom toolbar with Chadcn Svelte buttons -->
	<div
		class=" flex min-h-14 w-full items-center justify-between border-b border-stone-300 bg-stone-50 p-2"
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
			<p class="text-sm text-muted-foreground">
				Word Count: {$textContent.trim().split(/\s+/).length}
			</p>
		</div>
	</div>

	<!-- ProseMirror editor container -->

	<div class="custom-shadow flex w-full flex-1 items-start justify-center bg-stone-50">
		<div
			bind:this={editorContainer}
			class="editor__paragraph prose prose-sm flex-1 lg:prose-base xl:prose-lg"
			id="editor"
		></div>
	</div>
</section>

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

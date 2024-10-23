<script lang="ts">
	import { onMount } from 'svelte';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { DOMParser } from 'prosemirror-model';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap } from 'prosemirror-commands';
	import { writable } from 'svelte/store';
	import mySchema from '$lib/features/rich-text-editor/entities/Schema';

	import { history } from 'prosemirror-history'; // Import history plugin and commands
	import ToolBar from './ToolBar.svelte';
	import ExportButton from './ExportButton.svelte';

	let editorContainer: HTMLDivElement | null = $state(null);
	let view: EditorView | null = $state(null);

	const content = writable('<p>Hello ProseMirror in Svelte!</p>');

	onMount(() => {
		const state = EditorState.create({
			schema: mySchema,
			doc: DOMParser.fromSchema(mySchema).parse(
				document.createRange().createContextualFragment($content)
			),
			plugins: [history(), keymap(baseKeymap)]
		});

		view = new EditorView(editorContainer, {
			state,
			dispatchTransaction(transaction) {
				const newState = view!.state.apply(transaction);
				view!.updateState(newState);
				content.set(newState.doc.content.toString());
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
		<ToolBar view={view!} {mySchema}></ToolBar>
		<ExportButton></ExportButton>
	</div>

	<!-- ProseMirror editor container -->
	<div
		bind:this={editorContainer}
		class="prose prose-base w-[700px] flex-1 bg-stone-50 focus:outline-none"
		id="editor"
	></div>
</section>

<style>
	#editor {
		padding: 30px;
		min-height: 200px;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { DOMParser } from 'prosemirror-model';
	import { toggleMark } from 'prosemirror-commands';
	import { Button } from '$lib/components/ui/button'; // Chadcn Svelte button
	import { schema } from 'prosemirror-schema-basic'; // Import basic schema
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap } from 'prosemirror-commands';
	import { writable } from 'svelte/store';
	import mySchema from '$lib/features/rich-text-editor/entities/Schema';
	import { setBlockType } from 'prosemirror-commands';
	import { history, undo, redo } from 'prosemirror-history'; // Import history plugin and commands

	let editorContainer: HTMLDivElement | null = $state(null);
	let view: EditorView | null = $state(null);

	function toggleHeading(level: number) {
		if (!view) return;
		const { state, dispatch } = view;
		setBlockType(mySchema.nodes.heading, { level })(state, dispatch);
	}

	function toggleParagraph() {
		if (!view) return;
		const { state, dispatch } = view;
		setBlockType(mySchema.nodes.paragraph)(state, dispatch);
	}

	// Toggle bold formatting
	function toggleBold() {
		if (!view) return;
		const { state, dispatch } = view;
		const { schema } = state;
		toggleMark(schema.marks.bold)(state, dispatch);
	}

	// Toggle italic formatting
	function toggleItalic() {
		if (!view) return;
		const { state, dispatch } = view;
		const { schema } = state;
		toggleMark(schema.marks.italic)(state, dispatch);
	}

	function setTextAlign(align: string) {
		if (!view) return;
		const { state, dispatch } = view;
		const { $from: selectioFrom } = state.selection;
		const node = selectioFrom.node(selectioFrom.depth);

		if (node.type === mySchema.nodes.paragraph || node.type === mySchema.nodes.heading) {
			const attrs = { ...node.attrs, align };
			setBlockType(node.type, attrs)(state, dispatch);
		}
	}

	function highlightWords(words: string[]) {
		if (!view) return;
		const { state, dispatch } = view;
		const { tr } = state;
		const regex = new RegExp(words.join('|'), 'gi');

		tr.doc.descendants((node, pos) => {
			if (node.isText) {
				let match;
				while ((match = regex.exec(node.text!)) !== null) {
					tr.addMark(
						pos + match.index,
						pos + match.index + match[0].length,
						state.schema.marks.red.create()
					);
				}
			}
		});

		if (tr.docChanged) {
			dispatch(tr);
		}
	}

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
		<Button on:click={toggleBold}>Bold</Button>
		<Button on:click={toggleItalic}>Italic</Button>
		<Button on:click={toggleParagraph}>P</Button>
		<Button on:click={() => toggleHeading(1)}>H1</Button>
		<Button on:click={() => toggleHeading(2)}>H2</Button>
		<Button on:click={() => toggleHeading(3)}>H3</Button>
		<Button on:click={() => setTextAlign('left')}>Align Left</Button>
		<Button on:click={() => setTextAlign('center')}>Align Center</Button>
		<Button on:click={() => setTextAlign('right')}>Align Right</Button>
		<Button on:click={() => highlightWords(['Hello', 'Svelte'])}>Highlight Words</Button>
		<Button on:click={() => undo(view.state, view.dispatch)}>Undo</Button>
		<Button on:click={() => redo(view.state, view.dispatch)}>Redo</Button>
	</div>

	<!-- ProseMirror editor container -->
	<div
		bind:this={editorContainer}
		class="prose prose-lg w-[700px] flex-1 bg-stone-50"
		id="editor"
	></div>
</section>

<style>
	#editor {
		padding: 30px;
		min-height: 200px;
	}
	/* Remove outline from the div when focused */
	#editor:focus {
		outline: none !important; /* Use !important if necessary */
	}
</style>

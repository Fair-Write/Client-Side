<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { setBlockType, toggleMark } from 'prosemirror-commands';
	import type { Schema } from 'prosemirror-model';
	import type { EditorView } from 'prosemirror-view';
	import { undo, redo } from 'prosemirror-history';

	let { view, mySchema }: { view: EditorView; mySchema: Schema } = $props();

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
</script>

<div>
	<Button on:click={toggleBold}>Bold</Button>
	<Button on:click={toggleItalic}>Italic</Button>
	<Button on:click={toggleParagraph}>P</Button>
	<Button on:click={() => toggleHeading(1)}>H1</Button>
	<Button on:click={() => toggleHeading(2)}>H2</Button>
	<Button on:click={() => toggleHeading(3)}>H3</Button>
	<Button on:click={() => setTextAlign('left')}>Align Left</Button>
	<Button on:click={() => setTextAlign('center')}>Align Center</Button>
	<Button on:click={() => setTextAlign('right')}>Align Right</Button>
	<Button on:click={() => undo(view.state, view.dispatch)}>Undo</Button>
	<Button on:click={() => redo(view.state, view.dispatch)}>Redo</Button>
</div>

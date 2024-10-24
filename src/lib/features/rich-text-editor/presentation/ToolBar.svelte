<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { setBlockType, toggleMark } from 'prosemirror-commands';
	import type { Schema } from 'prosemirror-model';
	import type { EditorView } from 'prosemirror-view';
	import { undo, redo } from 'prosemirror-history';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import {
		AlignCenter,
		AlignLeft,
		AlignRight,
		Bold,
		Italic,
		Pilcrow,
		Redo2,
		Undo2
	} from 'lucide-svelte';

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

<div class="flex items-center justify-center gap-3">
	<!-- Heading -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline">Heading</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>All Headings</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item on:click={() => toggleHeading(1)}>Heading 1</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => toggleHeading(2)}>Heading 2</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => toggleHeading(3)}>Heading 3</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<!-- Styles -->
	<div>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button size="icon" class="w-10 h-10 " variant="outline" on:click={toggleBold}
					><Bold /></Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p class="text-muted-foreground text-sm">Bold</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button size="icon" class="w-10 h-10" variant="outline" on:click={toggleItalic}
					><Italic /></Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Italic</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button size="icon" class="w-10 h-10" variant="outline" on:click={toggleParagraph}
					><Pilcrow /></Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Paragraph</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<!-- alignment -->
	<div>
		<!-- Justify -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					size="icon"
					class="w-10 h-10"
					variant="outline"
					on:click={() => setTextAlign('left')}><AlignLeft /></Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Align Left</p>
			</Tooltip.Content>
		</Tooltip.Root>
		<!-- Align Center -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					size="icon"
					class="w-10 h-10"
					variant="outline"
					on:click={() => setTextAlign('center')}><AlignCenter /></Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Align Center</p>
			</Tooltip.Content>
		</Tooltip.Root>
		<!-- Align Right -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					size="icon"
					class="w-10 h-10"
					variant="outline"
					on:click={() => setTextAlign('right')}><AlignRight /></Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Align Right</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<!-- history -->
	<div class="">
		<!-- Undo -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button size="icon" variant="outline" on:click={() => undo(view.state, view.dispatch)}
					><Undo2 /></Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Undo</p>
			</Tooltip.Content>
		</Tooltip.Root>
		<!-- Redo -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					size="icon"
					class="w-10 h-10"
					variant="outline"
					on:click={() => redo(view.state, view.dispatch)}><Redo2 /></Button
				>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Redo</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>

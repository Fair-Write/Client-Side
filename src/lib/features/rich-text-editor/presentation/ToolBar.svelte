<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { setBlockType, toggleMark } from 'prosemirror-commands';
	import type { Schema } from 'prosemirror-model';
	import type { EditorView } from 'prosemirror-view';
	import { undo, redo } from 'prosemirror-history';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import {
		AlignCenter,
		AlignLeft,
		AlignRight,
		Bold,
		ChevronDown,
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
		<DropdownMenu.Trigger>
			<Button variant="secondary" class=" rounded-md"
				>H
				<ChevronDown />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>All Headings</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => toggleHeading(1)}>Heading 1</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => toggleHeading(2)}>Heading 2</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => toggleHeading(3)}>Heading 3</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<!-- Styles -->
	<div class="border-x border-solid border-stone-300 px-1">
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button size="icon" class="h-8 w-8 " variant="ghost" onclick={toggleBold}><Bold /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p class="text-sm text-muted-foreground">Bold</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>

		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button size="icon" class="h-8 w-8" variant="ghost" onclick={toggleItalic}
						><Italic /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Italic</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>

		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button size="icon" class="h-8 w-8" variant="ghost" onclick={toggleParagraph}
						><Pilcrow /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Paragraph</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
	<!-- alignment -->
	<div class="border-r border-solid border-stone-300 px-1">
		<!-- Justify -->
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						size="icon"
						class="m-0 h-8 w-8"
						variant="ghost"
						onclick={() => setTextAlign('left')}><AlignLeft /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Align Left</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>

		<!-- Align Center -->
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button size="icon" class="h-8 w-8" variant="ghost" onclick={() => setTextAlign('center')}
						><AlignCenter /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Align Center</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>

		<!-- Align Right -->

		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button size="icon" class="h-8 w-8" variant="ghost" onclick={() => setTextAlign('right')}
						><AlignRight /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Align Right</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
	<!-- history -->
	<div class="">
		<!-- Undo -->
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button size="icon" variant="ghost" onclick={() => undo(view.state, view.dispatch)}
						><Undo2 /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Undo</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>

		<!-- Redo -->
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						size="icon"
						class="h-8 w-8"
						variant="ghost"
						onclick={() => redo(view.state, view.dispatch)}><Redo2 /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Redo</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
</div>

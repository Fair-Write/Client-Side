<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { setBlockType, toggleMark } from 'prosemirror-commands';
	import type { Schema } from 'prosemirror-model';
	import type { EditorView } from 'prosemirror-view';
	import { undo, redo } from 'prosemirror-history';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { wrapInList } from 'prosemirror-schema-list';
	import { MarkType } from 'prosemirror-model';

	import {
		AlignCenter,
		AlignJustify,
		AlignLeft,
		AlignRight,
		Bold,
		ChevronDown,
		Italic,
		List,
		Pilcrow,
		Redo2,
		Underline,
		Undo2
	} from 'lucide-svelte';

	let { view, mySchema }: { view: EditorView; mySchema: Schema } = $props();
	let currentFontSize = $state('16px'); // Default font size
	let currentFontFamily = $state('Arial'); // Default font family
	let currentColor = $state('black');
	function setFontSize(size: string) {
		if (!view) return;
		console.log('setFontSize', size);

		const { state, dispatch } = view;
		const { from, to } = state.selection;

		state.doc.nodesBetween(from, to, (node, pos) => {
			if (node.type === mySchema.nodes.paragraph || node.type === mySchema.nodes.heading) {
				const attrs = { ...node.attrs, fontSize: size };
				setBlockType(node.type, attrs)(state, dispatch);
			}
		});
	}

	function setFontFamily(fontFamily: string) {
		if (!view) return;
		console.log('setFontFamily', fontFamily);

		const { state, dispatch } = view;
		const { from, to } = state.selection;

		state.doc.nodesBetween(from, to, (node, pos) => {
			if (node.type === mySchema.nodes.paragraph || node.type === mySchema.nodes.heading) {
				const attrs = { ...node.attrs, fontFamily: fontFamily };
				setBlockType(node.type, attrs)(state, dispatch);
			}
		});

		currentFontFamily = fontFamily; // Update the current font family
	}

	function applyTextColor(view: EditorView, markType: MarkType, color: string) {
		const { state, dispatch } = view;
		const { from, to, empty } = state.selection;

		const tr = state.tr;

		if (empty) {
			// Remove old color marks
			state.storedMarks?.forEach((mark) => {
				if (mark.type === markType) {
					tr.removeStoredMark(markType);
				}
			});
			// Add new color mark
			tr.addStoredMark(markType.create({ color }));
			dispatch(tr);
			return true;
		}

		// Remove all color marks in selection
		tr.removeMark(from, to, markType);
		// Apply the new one
		tr.addMark(from, to, markType.create({ color }));

		dispatch(tr);
		return true;
	}

	function setColor(color: string) {
		if (!view) return;
		const colorMark = mySchema.marks.color;
		applyTextColor(view, colorMark, color);
	}

	// Function to update the current font size based on the selection
	function updateCurrentFontSize() {
		if (!view) return;

		const { state } = view;
		const { $from: selectionFrom } = state.selection;
		const node = selectionFrom.node(selectionFrom.depth);

		if (node.type === mySchema.nodes.paragraph || node.type === mySchema.nodes.heading) {
			currentFontSize = node.attrs.fontSize || '16px';
			currentFontFamily = node.attrs.fontFamily || 'Arial';
		}
	}

	// Add an event listener to update the current font size whenever the selection changes
	view.dom.addEventListener('mouseup', updateCurrentFontSize);
	view.dom.addEventListener('keyup', updateCurrentFontSize);

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

	function toggleUnderline() {
		if (!view) return;
		const { state, dispatch } = view;
		const { schema } = state;
		toggleMark(schema.marks.underline)(state, dispatch);
	}

	function setTextAlign(align: string) {
		if (!view) return;
		const { state, dispatch } = view;
		const { $from: selectionFrom } = state.selection;
		const node = selectionFrom.node(selectionFrom.depth);

		if (node.type === mySchema.nodes.paragraph || node.type === mySchema.nodes.heading) {
			const attrs = { ...node.attrs, align };
			setBlockType(node.type, attrs)(state, dispatch);
		}
	}
	function toggleBulletList() {
		if (!view) return false;
		return wrapInList(mySchema.nodes.bullet_list)(view.state, view.dispatch, view);
	}

	function isInbulletList() {
		if (!view) return false;
		const { state } = view;
		const { from, to } = state.selection;
		let isInList = false;

		state.doc.nodesBetween(from, to, (node) => {
			if (node.type === mySchema.nodes.bullet_list) {
				isInList = true;
				return false;
			}
		});

		return isInList;
	}

	function canApplyBulletList() {
		if (!view) return false;
		return wrapInList(mySchema.nodes.bullet_list)(view.state);
	}
</script>

<div class="hidden items-center justify-center gap-3 lg:flex">
	<!-- Display current font size -->

	<!-- Heading -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button variant="secondary" class="rounded-md p-1">H <ChevronDown /></Button>
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

	<!-- Font Size -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button variant="secondary" class="w-[90px] rounded-md p-1 text-xs 2xl:text-base"
				>Size: {currentFontSize} <ChevronDown /></Button
			>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Font Sizes</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => setFontSize('8pt')}>8</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('10pt')}>10</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('12pt')}>12</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('14pt')}>14</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('16pt')}>16</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('18pt')}>18</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('20pt')}>20</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('24pt')}>24</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('28pt')}>28</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('32pt')}>32</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontSize('36pt')}>36</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- color -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button
				style={`color:${currentColor};`}
				variant="secondary"
				class="w-[90px] rounded-md p-1 text-xs 2xl:text-base">Color: <ChevronDown /></Button
			>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Color</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					onclick={() => {
						setColor('oklch(57.7% 0.245 27.325)');
					}}>Red</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => {
						setColor('oklch(64.6% 0.222 41.116)');
					}}>Orange</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => {
						setColor('oklch(79.5% 0.184 86.047)');
					}}>Yellow</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => {
						setColor('oklch(52.7% 0.154 150.069)');
					}}>Green</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => {
						setColor('oklch(54.6% 0.245 262.881)');
					}}>Blue</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => {
						setColor('oklch(54.1% 0.281 293.009)');
					}}>Violet</DropdownMenu.Item
				>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- Font Family -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button
				variant="secondary"
				class="flex items-center  justify-start rounded-md p-1 lg:w-[100px] 2xl:w-[150px]"
				><p class="text-xs 2xl:text-base">Font:</p>
				<span class="hidden truncate text-xs 2xl:block 2xl:text-base"
					>{currentFontFamily}
				</span><ChevronDown /></Button
			>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Font Families</DropdownMenu.Label>
				<DropdownMenu.Separator />

				<DropdownMenu.Item onclick={() => setFontFamily('Arial')}>Arial</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontFamily('Helvetica')}>Helvetica</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontFamily('Verdana')}>Verdana</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontFamily('Tahoma')}>Tahoma</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontFamily('Trebuchet MS')}
					>Trebuchet MS</DropdownMenu.Item
				>

				<DropdownMenu.Separator />

				<DropdownMenu.Item onclick={() => setFontFamily('Times New Roman')}
					>Times New Roman</DropdownMenu.Item
				>
				<DropdownMenu.Item onclick={() => setFontFamily('Times')}>Times</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontFamily('Georgia')}>Georgia</DropdownMenu.Item>

				<DropdownMenu.Separator />

				<DropdownMenu.Item onclick={() => setFontFamily('Courier New')}
					>Courier New</DropdownMenu.Item
				>
				<DropdownMenu.Item onclick={() => setFontFamily('Courier')}>Courier</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontFamily('Consolas')}>Consolas</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setFontFamily('Monaco')}>Monaco</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- Styles -->
	<div class="border-x border-solid border-stone-300 px-1">
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button size="icon" class="h-6 w-6" variant="ghost" onclick={toggleBold}><Bold /></Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p class="text-sm text-muted-foreground">Bold</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
		<!-- Under line -->
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button size="icon" class="h-6 w-6" variant="ghost" onclick={toggleUnderline}>
						<Underline></Underline>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Underline</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button size="icon" class="h-6 w-6" variant="ghost" onclick={toggleItalic}
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
					<Button size="icon" class="h-6 w-6" variant="ghost" onclick={toggleParagraph}
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
						class="m-0 h-6 w-6"
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
					<Button size="icon" class="h-6 w-6" variant="ghost" onclick={() => setTextAlign('center')}
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
					<Button size="icon" class="h-6 w-6" variant="ghost" onclick={() => setTextAlign('right')}
						><AlignRight /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Align Right</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
		<!-- JUSTIFY -->
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						size="icon"
						class="h-6 w-6"
						variant="ghost"
						onclick={() => setTextAlign('justify')}
					>
						<AlignJustify></AlignJustify>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Align Justify</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>

	<!-- bullet -->

	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					size="icon"
					variant="ghost"
					disabled={!canApplyBulletList()}
					onclick={() => toggleBulletList()}
				>
					<List></List>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Add Bullets</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
	<!-- history -->
	<div class="flex items-center justify-center">
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
						class="h-6 w-6"
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

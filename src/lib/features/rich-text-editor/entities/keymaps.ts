import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import mySchema from '$lib/features/rich-text-editor/entities/Schema';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import { splitListItem } from 'prosemirror-schema-list';
export const myKeymap = keymap({
	'Mod-z': undo,
	'Mod-y': redo,
	'Mod-Shift-z': redo,
	'Mod-b': toggleMark(mySchema.marks.bold), // "Mod" works as "Ctrl" on Windows and "Cmd" on Mac
	'Mod-i': toggleMark(mySchema.marks.italic),
	'Mod-Shift-8': wrapInList(mySchema.nodes.bullet_list)
});

export const extendedKeyMap = keymap({
	'Mod-Enter': splitListItem(mySchema.nodes.list_item),
	Enter: (state, dispatch) => {
		const { selection, tr } = state;
		const { $from } = selection;

		// Get the current node
		const currentNode = $from.parent;

		// Check if the node is empty
		if (currentNode.content.size === 0) {
			return false; // Let default behavior handle empty nodes
		}

		// Get the text content of the current node
		const nodeText = currentNode.textContent;

		// Check if the node already ends with a space
		if (nodeText.endsWith(' ')) {
			return false; // Let default behavior handle nodes that already end with space
		}

		// Add a space before proceeding with enter
		if (dispatch) {
			const spaceTransaction = tr.insertText(' ', selection.from);
			dispatch(spaceTransaction);
		}

		return false; // Let default enter behavior proceed
	}
});

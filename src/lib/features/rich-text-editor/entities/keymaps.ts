import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import mySchema from '$lib/features/rich-text-editor/entities/Schema';
import {toggleMark} from 'prosemirror-commands';

export const myKeymap = keymap({
	'Mod-z': undo,
	'Mod-y': redo,
	'Mod-Shift-z': redo,
	'Mod-b': toggleMark(mySchema.marks.bold),  // "Mod" works as "Ctrl" on Windows and "Cmd" on Mac
	'Mod-i': toggleMark(mySchema.marks.italic),
});

import type { EditorView } from 'prosemirror-view';

export function highlightWords(words: string[], view: EditorView) {
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

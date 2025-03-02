import { EditorState, Transaction } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

import { getWordIndices } from '$lib/utils';
import { textContent } from '$lib/stores/textFromEditorStore';

import { get } from 'svelte/store';

export function replaceWordInDocument(
	editorState: EditorState,
	dispatch: (tr: Transaction) => void,
	words: TSuggestion
): void {
	const { replacement, originalText, indexReplacement, offSet, endSet } = words;
	const { doc } = editorState;
	const transaction = editorState.tr;

	// Traverse each text node in the document
	doc.descendants((node: Node, pos: number) => {
		if (node.isText && node.textContent) {
			const nodeText = node.text!;
			const start = offSet + 1;
			const end = endSet + 1;

			if (nodeText.slice(start, end) === originalText) {
				const marks = node.marks;
				const newTextNode = editorState.schema.text(replacement, marks);
				transaction.replaceWith(pos + start, pos + end, newTextNode);
			}
		}
	});

	// Apply the transaction if there were changes
	if (transaction.docChanged) {
		dispatch(transaction);
		console.log('REPLACE' + transaction.doc.textContent);
		textContent.set(transaction.doc.textContent);
		console.log('After' + get(textContent));
	}
}

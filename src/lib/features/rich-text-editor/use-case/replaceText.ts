import { EditorState, Transaction } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';


// todo: rework this what you have to do is find the node that contains the exact word
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

	// Array to store replacements

	// Traverse each text node in the document
	doc.descendants((node: Node, pos: number) => {
		if (node.isText && node.textContent) {
			// const nodeSplit = node.text!.split(' ')[indexReplacement];
			// const match = getWordIndices(node.text as string, indexReplacement);
			// if (match !== null && nodeSplit == originalText) {
			transaction.replaceWith(
				// match.start + 1,
				// match.end + 2,
				offSet + 1,
				endSet + 1,
				editorState.schema.text(replacement)
			);
			// }
		}
	});



	// Apply the transaction if there were changes
	if (transaction.docChanged) {
		dispatch(transaction);
		console.log("REPLACE" + transaction.doc.textContent);

		textContent.set(transaction.doc.textContent)
		console.log("After" + get(textContent));

	}
}

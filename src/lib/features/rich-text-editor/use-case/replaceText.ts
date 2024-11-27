import { EditorState, Transaction } from 'prosemirror-state';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

// Main function to replace a word in the ProseMirror document
export function replaceWordInDocument(
	editorState: EditorState,
	dispatch: (tr: Transaction) => void,
	words: Omit<TSuggestion, "indexReplacement"|'originalText'|'correctionType' | 'rationale' | 'message'>
): void {
	const {offSet,endSet, replacement } = words;
	const { doc } = editorState;
	let transaction = editorState.tr;

	// Track changes to prevent redundant operations
	let changed = false;

	// Traverse each text node in the document
	doc.descendants((node: ProseMirrorNode, pos: number) => {
		if (node.isText && node.textContent) {
			// Use the helper function to find the word's position

			const absoluteStart = pos+offSet
			const absoluteEnd = pos + endSet+1;

			console.log(absoluteStart, absoluteEnd);

			transaction = transaction.replaceWith(
				absoluteStart,
				absoluteEnd,
				editorState.schema.text(replacement)
			);
			changed = true;
		}
	});

	// Apply the transaction if there were changes
	if (changed) {
		dispatch(transaction);
	}
}

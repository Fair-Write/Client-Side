import { EditorState, Transaction } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';


// todo: rework this what you have to do is find the node that contains the exact word

export function replaceWordInDocument(
	editorState: EditorState,
	dispatch: (tr: Transaction) => void,
	words:Omit<TSuggestion, 'indexReplacement'|'correctionType'|"rationale"|"message">
): void {
	const { originalText,offSet,replacement} = words;
	const { doc } = editorState;
	const transaction = editorState.tr;

	// Array to store replacements
	const replacements: { from: number; to: number; text: string }[] = [];

	// Traverse each text node in the document
	doc.descendants((node: Node, pos: number) => {
		if (node.isText && node.textContent) {
			console.log(node.textContent);
			console.log(node.textContent);
			// const regex = new RegExp(`\\b${wrongPhrase}\\b`, 'g');
			// const matches = [...node.textContent.matchAll(regex)];

			if (pos == offSet) {
				const newText = node.textContent.replace(originalText, replacement);
				// Store the replacement range and text
				replacements.push({ from: pos, to: pos + node.nodeSize-1, text: newText });
			}
		}
	});

	// Apply replacements in reverse order to avoid range issues
	replacements.reverse().forEach(({ from, to, text }) => {
		transaction.replaceWith(from, to, editorState.schema.text(text));
	});

	// Apply the transaction if there were changes
	if (transaction.docChanged) {
		dispatch(transaction);
	}
}

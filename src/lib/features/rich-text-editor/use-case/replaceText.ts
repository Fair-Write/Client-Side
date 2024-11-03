import { EditorState, Transaction } from 'prosemirror-state';
import { Node } from 'prosemirror-model';

interface ReplaceWordParams {
	wrongWord: string;
	rightWord: string;
}

export function replaceWordInDocument(
	editorState: EditorState,
	dispatch: (tr: Transaction) => void,
	words: ReplaceWordParams
): void {
	const { wrongWord, rightWord } = words;
	const { doc } = editorState;
	const transaction = editorState.tr;

	// Array to store replacements
	const replacements: { from: number; to: number; text: string }[] = [];

	// Traverse each text node in the document
	doc.descendants((node: Node, pos: number) => {
		if (node.isText && node.textContent) {
			const regex = new RegExp(`\\b${wrongWord}\\b`, 'g');
			const matches = [...node.textContent.matchAll(regex)];

			if (matches.length > 0) {
				const newText = node.textContent.replace(regex, rightWord);

				// Store the replacement range and text
				replacements.push({ from: pos, to: pos + node.nodeSize, text: newText });
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

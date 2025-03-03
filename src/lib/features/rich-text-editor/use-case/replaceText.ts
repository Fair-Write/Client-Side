import { EditorState, Transaction } from 'prosemirror-state';
import { Node, Mark, Schema } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
import { textContent } from '$lib/stores/textFromEditorStore';
import { get } from 'svelte/store';

interface FormattingSegment {
	from: number;
	to: number;
	marks: readonly Mark[];
	length: number;
}

export function replaceWordInDocument(
	editorState: EditorState,
	dispatch: (tr: Transaction) => void,
	words: TSuggestion
): void {
	const { replacement, offSet, endSet } = words;
	const { doc, schema } = editorState;
	const transaction = editorState.tr;

	// First, we'll identify all the formatting segments in the selection
	const formattingSegments: FormattingSegment[] = [];

	doc.nodesBetween(offSet + 1, endSet + 1, (node, pos) => {
		if (node.isText) {
			// Calculate the overlap of this text node with our selection
			const from = Math.max(offSet, pos);
			const to = Math.min(endSet, pos + node.nodeSize);

			if (from < to) {
				formattingSegments.push({
					from,
					to,
					marks: node.marks,
					length: to - from
				});
			}
		}
		return true; // Continue traversal
	});

	if (formattingSegments.length > 0) {
		// Delete the original text
		transaction.delete(offSet + 1, endSet + 1);

		// If we only have one segment, it's simple
		if (formattingSegments.length === 1) {
			const textNode = schema.text(replacement, formattingSegments[0].marks);
			transaction.insert(offSet + 1, textNode);
		} else {
			// Multiple formatting segments - distribute the replacement text proportionally
			const totalOriginalLength = endSet - offSet;
			let insertPos = offSet + 1;
			let replacementPos = 0;

			formattingSegments.forEach((segment, index) => {
				// Calculate what portion of the replacement text should get this formatting
				const portion = segment.length / totalOriginalLength;
				let segmentLength = Math.round(replacement.length * portion);

				// For the last segment, use all remaining text to avoid rounding issues
				if (index === formattingSegments.length - 1) {
					segmentLength = replacement.length - replacementPos;
				}

				if (segmentLength > 0) {
					// Get the text for this segment
					const segmentText = replacement.slice(replacementPos, replacementPos + segmentLength);

					// Create a text node with the original formatting
					const textNode = schema.text(segmentText, segment.marks);

					// Insert it
					transaction.insert(insertPos, textNode);

					// Update positions
					insertPos += segmentText.length;
					replacementPos += segmentLength;
				}
			});
		}
	}

	if (transaction.docChanged) {
		dispatch(transaction);
		console.log('REPLACE: ' + transaction.doc.textContent);
		textContent.set(transaction.doc.textContent);
		console.log('After: ' + get(textContent));
	}
}

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

function computeHighlightOffsets(doc: Node, lintArgs: TSuggestion[]): number[] {
	let plainOffset = 0; // Running count of characters + newlines seen so far
	const offsets: number[] = [];

	doc.descendants((node: Node, pos: number) => {
		if (node.isText) {
			const text = node.text || '';
			const textLen = text.length;

			// Loop over all the suggestions (highlights)
			lintArgs.forEach((lint) => {
				const start = lint.offSet + 1; // Adjust offset for ProseMirror position
				const end = lint.endSet + 1;

				if (start < plainOffset + textLen && end > plainOffset) {
					const localFrom = Math.max(start - plainOffset, 0);
					const localTo = Math.min(end - plainOffset, textLen);
					const startPos = pos + localFrom;
					const endPos = pos + localTo;

					if (startPos < endPos) {
						// Collect only the offsets
						offsets.push(startPos, endPos);
					}
				}
			});

			// Update plainOffset to account for the current text length
			plainOffset += textLen;
		} else if (node.isTextblock && node.type.name !== 'doc') {
			// If the node is a block (like a paragraph or heading), account for the newline after it
			plainOffset += 1;
		}
	});

	return offsets;
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

	const nodesBefore: { type: string; pos: number }[] = [];
	doc.nodesBetween(0, offSet, (node, pos) => {
		if (node.isBlock && pos < offSet) {
			nodesBefore.push({
				type: node.type.name,
				pos: pos
			});
		}
		return true;
	});
	console.log('poop', nodesBefore.length);
	doc.nodesBetween(offSet + nodesBefore.length, endSet + nodesBefore.length, (node, pos) => {
		if (node.isText) {
			// Calculate the overlap of this text node with our selection
			const from = Math.max(offSet + nodesBefore.length - 1, pos);
			const to = Math.min(endSet + nodesBefore.length - 1, pos + node.nodeSize);

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

	// Compute the highlight offsets
	const highlightOffsets = computeHighlightOffsets(doc, [words]);

	console.log('Highlight Offsets: ', highlightOffsets); // Log the computed offsets

	// Apply the transaction if the document was changed
	if (transaction.docChanged) {
		dispatch(transaction);
		console.log('REPLACE: ' + transaction.doc.textContent);
		textContent.set(transaction.doc.textContent);
		console.log('After: ' + get(textContent));
	}
}

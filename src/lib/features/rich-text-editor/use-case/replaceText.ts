import { EditorState, Transaction } from 'prosemirror-state';
import { Mark } from 'prosemirror-model';
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
	const { chosenReplacement, offSet, endSet } = words;
	const { doc, schema } = editorState;

	// Convert text-based offsets to document positions
	const docPositions = convertTextOffsetsToDocPositions(doc, offSet, endSet);

	if (!docPositions) {
		console.error('Could not find valid document positions for the given text offsets');
		return;
	}

	const { from, to } = docPositions;

	// Validate the converted positions
	const docSize = doc.content.size;
	if (from < 0 || to < 0 || from > docSize || to > docSize || from >= to) {
		throw new Error(
			`Invalid document positions: from (${from}) to (${to}) in document of size (${docSize})`
		);
	}

	const transaction = editorState.tr;

	// Collect all formatting segments in the selection
	const formattingSegments: FormattingSegment[] = [];
	doc.nodesBetween(from, to, (node, pos) => {
		if (node.isText) {
			// Calculate the overlap of this text node with our selection
			const segmentFrom = Math.max(from, pos);
			const segmentTo = Math.min(to, pos + node.nodeSize);

			if (segmentFrom < segmentTo) {
				formattingSegments.push({
					from: segmentFrom,
					to: segmentTo,
					marks: node.marks,
					length: segmentTo - segmentFrom
				});
			}
		}
		return true; // Continue traversal
	});

	// Perform the replacement
	if (formattingSegments.length > 0) {
		// Delete the original text first
		transaction.delete(from, to);

		// If we only have one segment, it's simple
		if (formattingSegments.length === 1) {
			const textNode = schema.text(chosenReplacement, formattingSegments[0].marks);
			transaction.insert(from, textNode);
		} else {
			// Multiple formatting segments - distribute the replacement text proportionally
			const totalOriginalLength = to - from;
			let insertPos = from;
			let replacementPos = 0;

			formattingSegments.forEach((segment, index) => {
				// Calculate what portion of the replacement text should get this formatting
				const portion = segment.length / totalOriginalLength;
				let segmentLength = Math.round(chosenReplacement.length * portion);

				// For the last segment, use all remaining text to avoid rounding issues
				if (index === formattingSegments.length - 1) {
					segmentLength = chosenReplacement.length - replacementPos;
				}

				if (segmentLength > 0) {
					// Get the text for this segment
					const segmentText = chosenReplacement.slice(
						replacementPos,
						replacementPos + segmentLength
					);

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
	} else {
		// Fallback: if no formatting segments found, just replace with plain text
		transaction.delete(from, to);
		const textNode = schema.text(chosenReplacement);
		transaction.insert(from, textNode);
	}

	if (transaction.docChanged) {
		dispatch(transaction);
		console.log('REPLACE: ' + transaction.doc.textContent);
		textContent.set(transaction.doc.textContent);
		console.log('After: ' + get(textContent));
	}
}

/**
 * Convert text-based offsets (from textContent) to actual document positions
 */
function convertTextOffsetsToDocPositions(
	doc: any,
	textOffsetStart: number,
	textOffsetEnd: number
): { from: number; to: number } | null {
	let currentTextPos = 0;
	let docPosStart: number | null = null;
	let docPosEnd: number | null = null;

	doc.descendants((node: any, pos: number) => {
		if (node.isText) {
			const nodeTextLength = node.text.length;
			const nodeTextStart = currentTextPos;
			const nodeTextEnd = currentTextPos + nodeTextLength;

			// Check if our target start position is in this text node
			if (
				docPosStart === null &&
				textOffsetStart >= nodeTextStart &&
				textOffsetStart <= nodeTextEnd
			) {
				docPosStart = pos + (textOffsetStart - nodeTextStart);
			}

			// Check if our target end position is in this text node
			if (docPosEnd === null && textOffsetEnd >= nodeTextStart && textOffsetEnd <= nodeTextEnd) {
				docPosEnd = pos + (textOffsetEnd - nodeTextStart);
			}

			currentTextPos += nodeTextLength;

			// Early exit if we found both positions
			if (docPosStart !== null && docPosEnd !== null) {
				return false;
			}
		}
		return true;
	});

	if (docPosStart !== null && docPosEnd !== null) {
		return { from: docPosStart, to: docPosEnd };
	}

	return null;
}

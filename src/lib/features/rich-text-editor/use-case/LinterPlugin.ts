import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

const computeHighlightDecorations = (
	doc: ProseMirrorNode,
	lintArgs: TSuggestion[]
): DecorationSet => {
	const decorations: Decoration[] = [];
	let plainOffset = 0; // Running count of characters + newlines seen so far

	// Iterate through the document nodes
	doc.descendants((node: ProseMirrorNode, pos: number) => {
		if (node.isText) {
			const text = node.text || '';
			const textLen = text.length;

			// Loop over all the suggestions (highlights)
			lintArgs.forEach((lint) => {
				// Check if the highlight (from, to) overlaps with the current text node
				const start = lint.offSet + 1; // Adjust offset for ProseMirror position
				const end = lint.endSet + 1;

				const nodesBefore: { type: string; pos: number }[] = [];
				doc.nodesBetween(0, start, (node, pos) => {
					if (node.isBlock && pos < start) {
						nodesBefore.push({
							type: node.type.name,
							pos: pos
						});
					}
					return true;
				});
				console.log('nodes before', nodesBefore.length);
				if (start < plainOffset + textLen && end > plainOffset) {
					const localFrom = Math.max(start - plainOffset, 0);
					const localTo = Math.min(end - plainOffset, textLen);
					const startPos = pos + localFrom + nodesBefore.length - 1;
					const endPos = pos + localTo + nodesBefore.length - 1;

					if (startPos < endPos) {
						// Create the appropriate decoration
						switch (lint.correctionType) {
							case 'spelling':
								decorations.push(Decoration.inline(startPos, endPos, { class: 'linter-error' }));
								break;
							case 'grammar':
								decorations.push(Decoration.inline(startPos, endPos, { class: 'linter-grammar' }));
								break;
							case 'gfl':
								decorations.push(Decoration.inline(startPos, endPos, { class: 'linter-gfl' }));
								break;
						}
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

	// Return the created DecorationSet (or an empty one if no decorations)
	return decorations.length > 0 ? DecorationSet.create(doc, decorations) : DecorationSet.empty;
};

// Create the ProseMirror plugin
const createLinterPlugin = (lintArgs: TSuggestion[]) =>
	new Plugin({
		state: {
			init(_, { doc }) {
				// Compute decorations when the plugin is initialized
				return computeHighlightDecorations(doc, lintArgs);
			},
			apply(tr, old, _, newState) {
				if (tr.docChanged) {
					// Recompute decorations when the document changes
					return computeHighlightDecorations(newState.doc, lintArgs);
				}
				// Return the old decorations if the document hasn't changed
				return old;
			}
		},
		props: {
			decorations(state) {
				// Return the current state of decorations
				return this.getState(state);
			}
		}
	});

export default createLinterPlugin;

import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

// lintStringArr: string[], lintingType:string
type lintArgs = Omit<
	TSuggestion,
	'replacement' | 'originalText' | 'message' | 'rationale'
>;

const getWordIndices = (text: string, wordIndex: number): { start: number, end: number } | null => {
	const words = text.split(/\s+/);
	let currentIndex = 0;
	let startPos = 0;

	for (const word of words) {
		if (currentIndex === wordIndex) {
			const endPos = startPos + word.length;
			return { start: startPos, end: endPos };
		}
		startPos += word.length + 1; // +1 for the space character
		currentIndex++;
	}

	return null;
};

// Example usage:
const text = "This is a sample string for testing";
const wordIndex = 3;
const result = getWordIndices(text, wordIndex);
console.log(result); // { start: 10, end: 16 }

const linter = (doc: ProseMirrorNode, lintArgs: lintArgs[]): DecorationSet => {
	const decorations: Decoration[] = [];

	doc.descendants((node: ProseMirrorNode, pos) => {
		if (node.isText) {
			for (const lint of lintArgs) {
				const wordPosition = getWordIndices(doc.textContent, lint.indexReplacement);
				if (wordPosition) {
					const { start, end } = wordPosition;

					switch (lint.correctionType) {
						case 'spelling':
							decorations.push(
								Decoration.inline(start + pos, end + pos + 1, { class: 'linter-error' })
							);
							break;
						case 'grammar':
							decorations.push(
								Decoration.inline(start + pos, end + pos + 1, { class: 'linter-grammar' })
							);
							break;
						case 'gfl':
							decorations.push(
								Decoration.inline(start + pos, end + pos + 1, { class: 'linter-gfl' })
							);
					}
				}
			}
		}
	});

	return DecorationSet.create(doc, decorations);
};

// Create a ProseMirror plugin
const createLinterPlugin = (lintArgs: lintArgs[]) =>
	new Plugin({
		state: {
			init(_, { doc }) {
				return linter(doc, lintArgs);
			},
			apply(tr, old, _, newState) {
				if (tr.docChanged) {
					return linter(newState.doc, lintArgs);
				}
				return old;
			}
		},
		props: {
			decorations(state) {
				return this.getState(state);
			}
		}
	});

export default createLinterPlugin;

// this motherfucker gets the index
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
import { text } from '@sveltejs/kit';

// lintStringArr: string[], lintingType:string

function getWordIndices(
	sentence: string,
	wordIndex: number
): { start: number; end: number } | null {
	const words = sentence.split(/\s+/); // Split the sentence into words by whitespace
	if (wordIndex < 0 || wordIndex >= words.length) {
		return null; // Return null if the word index is out of bounds
	}

	let currentIndex = 0; // Keep track of the current index in the original sentence

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		const wordStart = sentence.indexOf(word, currentIndex);
		const wordEnd = wordStart + word.length - 1;

		if (i === wordIndex) {
			return { start: wordStart, end: wordEnd };
		}

		currentIndex = wordEnd + 1; // Move the current index past the current word
	}

	return null; // This shouldn't be reached under normal circumstances
}

const linter = (doc: ProseMirrorNode, lintArgs: TSuggestion[]): DecorationSet => {
	const decorations: Decoration[] = [];

	doc.descendants((node: ProseMirrorNode, pos: number) => {
		if (node.isText) {
			for (const lint of lintArgs) {
				const match = getWordIndices(node.text!, lint.indexReplacement);
				if (match !== null && node.text!.split(' ')[lint.indexReplacement] == lint.originalText) {
					const start = match.start + 1;
					console.log(match);

					const end = match.end + 2;
					console.log(start, end);
					switch (lint.correctionType) {
						case 'spelling':
							decorations.push(Decoration.inline(start, end, { class: 'linter-error ' }));
							break;
						case 'grammar':
							decorations.push(Decoration.inline(start, end, { class: 'linter-grammar' }));
							break;
						case 'gfl':
							decorations.push(Decoration.inline(start, end, { class: 'linter-gfl' }));
					}
				}
			}
		}
	});

	return DecorationSet.create(doc, decorations);
};

// Create a ProseMirror plugin
const createLinterPlugin = (lintArgs: TSuggestion[]) =>
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

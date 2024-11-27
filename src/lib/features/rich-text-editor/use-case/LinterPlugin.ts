import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

// lintStringArr: string[], lintingType:string
type lintArgs = Omit<
	TSuggestion,
	'replacement' | 'originalText' | 'message' | 'rationale' | 'indexReplacement'
>;
// this motherfucker gets the index

const linter = (doc: ProseMirrorNode, lintArgs: lintArgs[]): DecorationSet => {
	const decorations: Decoration[] = [];

	doc.descendants((node: ProseMirrorNode, pos) => {

		if (node.isText) {
			for (const lint of lintArgs) {
				const absoluteStart = pos + lint.offSet;
				const absoluteEnd = pos + lint.endSet + 1;

				switch (lint.correctionType) {
					case 'spelling':
						decorations.push(
							Decoration.inline(absoluteStart, absoluteEnd, { class: 'linter-error ' })
						);
						break;
					case 'grammar':
						decorations.push(
							Decoration.inline(absoluteStart, absoluteEnd, { class: 'linter-grammar' })
						);
						break;
					case 'gfl':
						decorations.push(
							Decoration.inline(absoluteStart, absoluteEnd, { class: 'linter-gfl' })
						);
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

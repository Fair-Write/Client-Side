import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

// lintStringArr: string[], lintingType:string
type lintArgs = Omit<TSuggestion, 'correctPhrase' | 'analysis' | 'heading'>;

const linter = (doc: ProseMirrorNode, lintArgs: lintArgs[]): DecorationSet => {
	const decorations: Decoration[] = [];

	doc.descendants((node: ProseMirrorNode, pos: number) => {
		if (node.isText) {
			for (const lint of lintArgs) {
				const regex = new RegExp(`\\b${lint.wrongPhrase}\\b`, 'g');

				let match;
				while ((match = regex.exec(node.text!)) !== null) {
					const start = pos + match.index;
					const end = start + match[0].length;

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

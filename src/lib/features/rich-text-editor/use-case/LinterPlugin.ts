import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

// lintStringArr: string[], lintingType:string
type lintArgs = Omit<
	TSuggestion,
	'replacement' | 'indexReplacement' | 'originalText' | 'message' | 'rationale'
>;

const linter = (doc: ProseMirrorNode, lintArgs: lintArgs[]): DecorationSet => {
	const decorations: Decoration[] = [];

	doc.descendants((node: ProseMirrorNode) => {
		if (node.isText) {
			for (const lint of lintArgs) {
				// pwede ko ditong gawin reference ko ung ireference ung
				// wordEnd = wordStart + word.length - 1;

				const start = 23;
				const end = 29;
				console.log(start);
				console.log(node.textContent.length);
				console.log(end);

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

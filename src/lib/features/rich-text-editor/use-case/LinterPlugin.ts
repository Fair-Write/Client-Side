import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';

const linter = (doc: ProseMirrorNode, regexArray: RegExp[]): DecorationSet => {
	const decorations: Decoration[] = [];

	doc.descendants((node: ProseMirrorNode, pos: number) => {
		if (node.isText) {
			for (const regex of regexArray) {
				let match;
				while ((match = regex.exec(node.text!)) !== null) {
					const start = pos + match.index;
					const end = start + match[0].length;
					decorations.push(Decoration.inline(start, end, { class: 'linter-error' }));
				}
			}
		}
	});

	return DecorationSet.create(doc, decorations);
};

// Create a ProseMirror plugin
const createLinterPlugin = (regexArray: RegExp[]) =>
	new Plugin({
		state: {
			init(_, { doc }) {
				return linter(doc, regexArray);
			},
			apply(tr, old, _, newState) {
				if (tr.docChanged) {
					return linter(newState.doc, regexArray);
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

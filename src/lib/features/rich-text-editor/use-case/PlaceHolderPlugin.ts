import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

function placeholder(placeholder:string) {
	return new Plugin({
		props: {
			decorations(state) {
				const textContent = state.doc.textContent;

				if (!textContent) {
					// Decoration.widget adds the placeholder decoration
					const decoration = Decoration.widget(0, () => {
						const span = document.createElement("span");
						span.setAttribute("data-placeholder", placeholder);
						span.classList.add("placeholder");
						return span;
					});
					return DecorationSet.create(state.doc, [decoration]);
				}
				return DecorationSet.empty;
			}
		}
	});
}

export { placeholder };

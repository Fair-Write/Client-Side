import { Plugin } from 'prosemirror-state';
import { Slice } from 'prosemirror-model';

export const cleanPastePlugin = new Plugin({
	props: {
		handlePaste(view, event) {
			// Get plain text from clipboard
			const text = event.clipboardData?.getData('text/plain');
			if (!text) return false;

			// Remove all tab characters
			const cleanedText = text.replace(/\t/g, '');

			// Create a new slice from the cleaned text
			const { schema } = view.state;
			const node = schema.text(cleanedText);
			const fragment = node ? schema.nodes.paragraph.create(null, node) : null;

			if (fragment) {
				const slice = new Slice(fragment.content, 0, 0);
				const tr = view.state.tr.replaceSelection(slice);
				view.dispatch(tr.scrollIntoView());
				return true; // Prevent default paste
			}

			return false;
		}
	}
});

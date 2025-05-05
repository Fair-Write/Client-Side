import { describe, it, expect } from 'vitest';
import { EditorState } from 'prosemirror-state';
import mySchema from '../entities/Schema';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { type TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
import createLinterPlugin from '../use-case/LinterPlugin';
// Helper to create doc from HTML string
const createDocFromHTML = (html: string) => {
	const container = document.createElement('div');
	container.innerHTML = html;
	return ProseMirrorDOMParser.fromSchema(mySchema).parse(container);
};
describe('createLinterPlugin', () => {
	it('adds correct decorations based on suggestions', () => {
		const doc = createDocFromHTML('<p>Hello world. This is ProseMirror.</p>');

		const suggestions: TSuggestion[] = [
			{
				offSet: 6,
				endSet: 11,
				correctionType: 'spelling',
				chosenReplacement: '',
				message: '',
				indexReplacement: 0,
				rationale: '',
				originalText: '',
				replacements: ['']
			} // highlights "world"
		];

		const plugin = createLinterPlugin(suggestions);

		const state = EditorState.create({
			doc,
			plugins: [plugin]
		});

		const decos = plugin.getState(state);
		expect(decos?.find()).toHaveLength(2);
		if (decos != undefined) {
			const [firstDeco, secondDeco] = decos.find();

			expect(firstDeco.from).toBeLessThan(firstDeco.to);
			expect(firstDeco.spec.class).toBe('linter-error');

			expect(secondDeco.from).toBeLessThan(secondDeco.to);
			expect(secondDeco.spec.class).toBe('linter-grammar');
		}
	});
});

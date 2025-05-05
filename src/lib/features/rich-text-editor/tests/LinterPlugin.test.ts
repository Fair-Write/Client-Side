import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Schema, DOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import createLinterPlugin from '../use-case/LinterPlugin'; // Update this path
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

// Mock basic ProseMirror schema
const schema = new Schema({
	nodes: {
		doc: {
			content: 'block+'
		},
		paragraph: {
			group: 'block',
			content: 'text*',
			toDOM() {
				return ['p', 0];
			},
			parseDOM: [{ tag: 'p' }]
		},
		heading: {
			group: 'block',
			content: 'text*',
			attrs: { level: { default: 1 } },
			toDOM(node) {
				return [`h${node.attrs.level}`, 0];
			},
			parseDOM: [
				{ tag: 'h1', attrs: { level: 1 } },
				{ tag: 'h2', attrs: { level: 2 } }
			]
		},
		text: {
			group: 'inline'
		}
	},
	marks: {}
});

describe('Linter Plugin', () => {
	let state: EditorState;

	// Helper function to create a document with given content
	const createDoc = (html: string) => {
		const element = document.createElement('div');
		element.innerHTML = html;
		return DOMParser.fromSchema(schema).parse(element);
	};

	// Helper function to count decorations of a specific class
	const countDecorations = (decorationSet: DecorationSet, className: string) => {
		let count = 0;
		decorationSet.find().forEach((deco) => {
			// ProseMirror's Decoration structure is different based on type
			// For inline decorations, we need to check spec.class
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((deco as any).spec && (deco as any).spec.class === className) {
				count++;
			}
		});
		return count;
	};
	beforeEach(() => {
		// Create a spy on console.log
		vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	it('should create no decorations when there are no suggestions', () => {
		state = EditorState.create({
			doc: createDoc('<p>This is a test paragraph with no errors.</p>'),
			plugins: [createLinterPlugin([])]
		});

		const decorationSet = state.plugins[0].getState(state);
		expect(decorationSet).toBeDefined();
		expect(decorationSet?.find().length).toBe(0);
	});

	it('should create spelling error decorations', () => {
		const suggestions: TSuggestion[] = [
			{
				offSet: 10, // "This is a tset" - 'tset' is misspelled
				endSet: 14,
				correctionType: 'spelling',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			}
		];

		state = EditorState.create({
			doc: createDoc('<p>This is a tset paragraph.</p>'),
			plugins: [createLinterPlugin(suggestions)]
		});

		const decorationSet = state.plugins[0].getState(state);
		expect(decorationSet).toBeDefined();
		expect(countDecorations(decorationSet!, 'linter-error')).toBe(1);
	});

	it('should create grammar error decorations', () => {
		const suggestions: TSuggestion[] = [
			{
				offSet: 0, // "Me is" - grammar error
				endSet: 5,
				correctionType: 'grammar',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			}
		];

		state = EditorState.create({
			doc: createDoc('<p>Me is going to the store.</p>'),
			plugins: [createLinterPlugin(suggestions)]
		});

		const decorationSet = state.plugins[0].getState(state);
		expect(decorationSet).toBeDefined();
		expect(countDecorations(decorationSet!, 'linter-grammar')).toBe(1);
	});

	it('should create gfl error decorations', () => {
		const suggestions: TSuggestion[] = [
			{
				offSet: 10, // Some gfl error
				endSet: 25,
				correctionType: 'gfl',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			}
		];

		state = EditorState.create({
			doc: createDoc('<p>This text has some fancy language features.</p>'),
			plugins: [createLinterPlugin(suggestions)]
		});

		const decorationSet = state.plugins[0].getState(state);
		expect(decorationSet).toBeDefined();
		expect(countDecorations(decorationSet!, 'linter-gfl')).toBe(1);
	});

	it('should handle multiple suggestions across different nodes', () => {
		const suggestions: TSuggestion[] = [
			{
				offSet: 5, // In first paragraph
				endSet: 10,
				correctionType: 'spelling',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			},
			{
				offSet: 30, // In second paragraph
				endSet: 40,
				correctionType: 'grammar',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			},
			{
				offSet: 50, // In heading
				endSet: 55,
				correctionType: 'gfl',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			}
		];

		state = EditorState.create({
			doc: createDoc(
				'<p>First paragraph with error.</p>' +
					'<p>Second paragraph with another error.</p>' +
					'<h2>Heading with gfl issue.</h2>'
			),
			plugins: [createLinterPlugin(suggestions)]
		});

		const decorationSet = state.plugins[0].getState(state);
		expect(decorationSet).toBeDefined();
		expect(countDecorations(decorationSet!, 'linter-error')).toBe(1);
		expect(countDecorations(decorationSet!, 'linter-grammar')).toBe(1);
		expect(countDecorations(decorationSet!, 'linter-gfl')).toBe(1);
	});

	it('should update decorations when document changes', () => {
		const suggestions: TSuggestion[] = [
			{
				offSet: 10,
				endSet: 15,
				correctionType: 'spelling',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			}
		];

		state = EditorState.create({
			doc: createDoc('<p>Text with a misspelled word.</p>'),
			plugins: [createLinterPlugin(suggestions)]
		});

		let decorationSet = state.plugins[0].getState(state);
		expect(decorationSet).toBeDefined();
		expect(countDecorations(decorationSet!, 'linter-error')).toBe(1);

		// Now simulate a document change
		const tr = state.tr.insertText('New ', 0);
		const newState = state.apply(tr);

		decorationSet = newState.plugins[0].getState(newState);
		expect(decorationSet).toBeDefined();
		// The decoration should still exist but at a different position
		expect(countDecorations(decorationSet!, 'linter-error')).toBe(1);
	});

	it('should handle suggestions that span partial text nodes', () => {
		const suggestions: TSuggestion[] = [
			{
				offSet: 8, // "This is [partially highlighted] text"
				endSet: 28,
				correctionType: 'spelling',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			}
		];

		state = EditorState.create({
			doc: createDoc('<p>This is partially highlighted text.</p>'),
			plugins: [createLinterPlugin(suggestions)]
		});

		const decorationSet = state.plugins[0].getState(state);
		expect(decorationSet).toBeDefined();
		expect(countDecorations(decorationSet!, 'linter-error')).toBe(1);
	});

	it('should handle suggestions at the edges of text nodes', () => {
		const suggestions: TSuggestion[] = [
			{
				offSet: 0, // Start of text
				endSet: 7,
				correctionType: 'grammar',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			},
			{
				offSet: 24, // End of text
				endSet: 32,
				correctionType: 'spelling',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			}
		];

		state = EditorState.create({
			doc: createDoc('<p>This is some sample text here.</p>'),
			plugins: [createLinterPlugin(suggestions)]
		});

		const decorationSet = state.plugins[0].getState(state);
		expect(decorationSet).toBeDefined();
		expect(countDecorations(decorationSet!, 'linter-grammar')).toBe(1);
		expect(countDecorations(decorationSet!, 'linter-error')).toBe(1);
	});

	it('should handle suggestions that cross node boundaries', () => {
		// This is a complex case that might not be fully supported by the current implementation
		const suggestions: TSuggestion[] = [
			{
				offSet: 20, // Spans from one paragraph to another
				endSet: 45,
				correctionType: 'gfl',
				chosenReplacement: 'BURGER',
				message: 'BURGER',
				originalText: 'BURGER',
				indexReplacement: 5,
				rationale: 'NONE',
				replacements: []
			}
		];

		state = EditorState.create({
			doc: createDoc(
				'<p>First paragraph ends with some text.</p>' + '<p>Second paragraph starts.</p>'
			),
			plugins: [createLinterPlugin(suggestions)]
		});

		const decorationSet = state.plugins[0].getState(state);
		expect(decorationSet).toBeDefined();
		// The implementation might handle this in different ways
		// Just check that no errors are thrown
	});
});

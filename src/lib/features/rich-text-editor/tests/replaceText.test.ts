import { describe, it, expect, vi, beforeEach } from 'vitest';
import { replaceWordInDocument } from '../use-case/replaceText';

import { Schema } from 'prosemirror-model';
import { EditorState, type Transaction } from 'prosemirror-state';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';

describe('replaceWordInDocument', () => {
	// Define a basic schema for testing
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
				}
			},
			text: {
				group: 'inline'
			}
		},
		marks: {
			bold: {
				toDOM() {
					return ['strong', 0];
				}
			},
			italic: {
				toDOM() {
					return ['em', 0];
				}
			}
		}
	});

	let dispatchedTransaction: Transaction | null = null;

	beforeEach(() => {
		// Reset mocks
		vi.clearAllMocks();
		console.log = vi.fn();
		dispatchedTransaction = null;
	});

	it('should replace text and update store with real transaction', () => {
		// Create a document with a paragraph containing "This is a test text"
		const doc = schema.node('doc', {}, [
			schema.node('paragraph', {}, [schema.text('This is a test text')])
		]);

		// Create a real EditorState
		const editorState = EditorState.create({
			doc,
			schema
		});

		// Create a real dispatch function
		const dispatch = (tr: Transaction) => {
			dispatchedTransaction = tr;
		};

		// Define the suggestion to replace "test" with "corrected"
		const suggestion: TSuggestion = {
			chosenReplacement: 'corrected',
			offSet: 10, // "This is a " -> 10 characters
			endSet: 14, // "test" -> 4 characters, so endSet is 10+4=14
			message: '',
			rationale: '',
			originalText: '',
			indexReplacement: 10,
			replacements: [],
			correctionType: 'gfl'
		};

		// Call the function
		replaceWordInDocument(editorState, dispatch, suggestion);

		// Verify that a transaction was dispatched
		expect(dispatchedTransaction).not.toBeNull();

		// Verify the transaction changes
		if (dispatchedTransaction) {
			// Apply the transaction to get the resulting state
			const newState = editorState.apply(dispatchedTransaction);

			// Check that the text was correctly replaced
			expect(newState.doc.textContent).toBe('This is a corrected text');
		}
	});
});

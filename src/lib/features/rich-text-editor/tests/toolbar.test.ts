/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect, beforeEach } from 'vitest';
import { Schema } from 'prosemirror-model';
import { setBlockType } from 'prosemirror-commands';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema as basicSchema } from 'prosemirror-schema-basic';

// Define your schema with heading node
const mySchema = new Schema({
	nodes: basicSchema.spec.nodes,
	marks: basicSchema.spec.marks
});

let view: EditorView;
function toggleHeading(level: number, view: EditorView) {
	if (!view) return;
	const { state, dispatch } = view;
	setBlockType(mySchema.nodes.heading, { level })(state, dispatch);
}

function setFontSize(size: string, view: EditorView) {
	if (!view) return;
	console.log('setFontSize', size);

	const { state, dispatch } = view;
	const node = state.selection.$from.node();

	if (node.type === mySchema.nodes.paragraph || node.type === mySchema.nodes.heading) {
		const attrs = { ...node.attrs, fontSize: size };
		setBlockType(node.type, attrs)(state, dispatch);
	}
}

function setFontFamily(fontFamily: string, view: EditorView) {
	if (!view) return;
	console.log('setFontFamily', fontFamily);

	const { state, dispatch } = view;
	const node = state.selection.$from.node();

	if (node.type === mySchema.nodes.paragraph || node.type === mySchema.nodes.heading) {
		const attrs = { ...node.attrs, fontFamily: fontFamily };
		setBlockType(node.type, attrs)(state, dispatch);
	}
}

beforeEach(() => {
	// Create a DOM element for the editor
	const div = document.createElement('div');
	document.body.appendChild(div);

	// Create a starting document
	const doc = mySchema.topNodeType.createAndFill();

	// Create the editor state
	const state = EditorState.create({
		// @ts-expect-error
		doc,
		schema: mySchema
	});

	// Initialize the editor view
	view = new EditorView(div, {
		state
	});
});

describe('toggleHeading', () => {
	it('should set the block type to heading level 2', () => {
		toggleHeading(2, view);

		const node = view.state.doc.firstChild;
		expect(node?.type.name).toBe('heading');
		expect(node?.attrs.level).toBe(2);
	});
});

describe('setFontSize', () => {
	it('should set fontSize attribute on paragraph', () => {
		setFontSize('24px', view);

		const node = view.state.doc.firstChild;
		expect(node?.type.name).toBe('paragraph');
		expect(node?.attrs.fontSize).not.toBe(null);
	});
});

describe('fonFamily', () => {
	it('should set the font family', () => {
		setFontFamily('Arial', view);

		const node = view.state.doc.firstChild;

		expect(node?.attrs.fontFamily).not.toBe(null);
	});
});

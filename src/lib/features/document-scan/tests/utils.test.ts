import { describe, expect, test } from 'vitest';
import { getSuffix } from '../use-case/utilts';

describe('getSuffix', () => {
	test('get the word pdf from joebiden.pdf', () => {
		expect(getSuffix('joebiden.pdf')).toBe('pdf');
	});

	test('get the word docx from joebiden.docx', () => {
		expect(getSuffix('joebiden.docx')).toBe('docx');
	});


	test('to throw an error on invalid file type in joebiden.js', () => {
		expect(() => getSuffix('joebiden.js')).toThrowError('Invalid File Type');
	});

	test('get the word docx from pdf.docx', () => {
		expect(getSuffix('pdf.docx')).toBe('docx');
	});
});

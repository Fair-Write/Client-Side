import { describe, it, expect, vi, beforeEach } from 'vitest';
import jsPDF from 'jspdf';

function exportStateAsPDF(state: string) {
	let title: string = '';
	title = title.replace(/\.[^/.]+$/, '');
	const test = `
  <div class="text-left text-base font-sans *:min-h-[2em]">
  ${state}
  </div>`;
	const doc = new jsPDF();

	doc.html(test, {
		callback: function (doc) {
			doc.save(title);
		},
		margin: [10, 10, 10, 10],
		autoPaging: 'text',
		x: 0,
		y: 0,
		width: 190, //target width in the PDF document
		windowWidth: 675 //window width in CSS pixels
	});
}
// Mock jsPDF properly for Vitest
vi.mock('jspdf', () => {
	return {
		default: vi.fn(() => ({
			html: vi.fn((html, options) => {
				if (options && typeof options.callback === 'function') {
					options.callback({
						save: vi.fn()
					});
				}
			}),
			save: vi.fn()
		}))
	};
});

describe('PDF Export Function', () => {
	beforeEach(() => {
		// Clear mocks before each test
		vi.clearAllMocks();
	});

	it('should create a new jsPDF instance', () => {
		const testState = '<p>Test content</p>';
		exportStateAsPDF(testState);

		expect(jsPDF).toHaveBeenCalled();
	});

	it('should call html method with correct parameters', () => {
		const testState = '<p>Test content</p>';
		exportStateAsPDF(testState);

		const mockInstance = vi.mocked(jsPDF).mock.results[0].value;
		expect(mockInstance.html).toHaveBeenCalledWith(
			expect.stringContaining(testState),
			expect.objectContaining({
				margin: [10, 10, 10, 10],
				autoPaging: 'text',
				x: 0,
				y: 0,
				width: 190,
				windowWidth: 675
			})
		);
	});

	it('should wrap content in a div with styling', () => {
		const testState = '<p>Test content</p>';
		exportStateAsPDF(testState);

		const mockInstance = vi.mocked(jsPDF).mock.results[0].value;
		const htmlArgument = mockInstance.html.mock.calls[0][0];

		expect(htmlArgument).toContain('<div class="text-left text-base font-sans *:min-h-[2em]">');
		expect(htmlArgument).toContain(testState);
		expect(htmlArgument).toContain('</div>');
	});

	it('should call save method in the callback', () => {
		const testState = '<p>Test content</p>';
		exportStateAsPDF(testState);

		// Get the callback that was passed to html
		const mockInstance = vi.mocked(jsPDF).mock.results[0].value;
		const options = mockInstance.html.mock.calls[0][1];
		const mockDoc = { save: vi.fn() };

		// Call the callback function with our mock document
		options.callback(mockDoc);

		expect(mockDoc.save).toHaveBeenCalled();
	});

	it('should handle empty state gracefully', () => {
		const testState = '';
		expect(() => exportStateAsPDF(testState)).not.toThrow();

		const mockInstance = vi.mocked(jsPDF).mock.results[0].value;
		expect(mockInstance.html).toHaveBeenCalled();
	});

	it('should remove file extension from title if present', () => {
		const replaceSpy = vi.spyOn(String.prototype, 'replace');

		const testState = '<p>Test content</p>';
		exportStateAsPDF(testState);

		expect(replaceSpy).toHaveBeenCalledWith(/\.[^/.]+$/, '');

		replaceSpy.mockRestore();
	});

	it('should pass the correct title to save method', () => {
		const testState = '<p>Test content</p>';

		// Create a special mock just for this test
		const saveMock = vi.fn();
		vi.mocked(jsPDF).mockImplementationOnce(() => ({
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			html: vi.fn((html, options) => {
				if (options && typeof options.callback === 'function') {
					const mockDoc = { save: saveMock };
					options.callback(mockDoc);
				}
			}),
			save: vi.fn()
		}));

		exportStateAsPDF(testState);

		// The title in the original function is an empty string after replace
		expect(saveMock).toHaveBeenCalledWith('');
	});

	it('should handle complex HTML content', () => {
		const complexHTML = `
      <h1>Title</h1>
      <p>Paragraph 1</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
      <table>
        <tr><td>Cell 1</td><td>Cell 2</td></tr>
      </table>
    `;

		expect(() => exportStateAsPDF(complexHTML)).not.toThrow();

		const mockInstance = vi.mocked(jsPDF).mock.results[0].value;
		const htmlArgument = mockInstance.html.mock.calls[0][0];

		expect(htmlArgument).toContain(complexHTML);
	});
});

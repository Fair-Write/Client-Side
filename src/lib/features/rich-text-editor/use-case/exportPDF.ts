import type { EditorState } from 'prosemirror-state';
 // Import the Document type for docx


// Function to convert Blob to ArrayBuffer
function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as ArrayBuffer);
		reader.onerror = reject;
		reader.readAsArrayBuffer(blob);
	});
}

// Define the function to export the editor state as DOCX and then convert to PDF
export async function exportStateAsPDF(state: EditorState): Promise<void> {
	const { defaultDocxSerializer } = await import('prosemirror-docx');
	const { Packer } = await import('docx');
	const { saveAs } = await import('file-saver');
	const { jsPDF } = await import('jspdf');
	const Mammoth = await import('mammoth');

	// Serialize the ProseMirror document to a DOCX format
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const wordDocument: Document = defaultDocxSerializer.serialize(state.doc);

	// Convert the serialized document to a Blob
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const docxBlob: Blob = (await Packer.toBlob(wordDocument)) as Blob;

	// Convert Blob to ArrayBuffer for Mammoth
	const arrayBuffer = await blobToArrayBuffer(docxBlob);

	// Use Mammoth to convert DOCX to HTML
	const { value: html } = await Mammoth.convertToHtml({ arrayBuffer });

	// Now, create a PDF from the HTML
	const pdf = new jsPDF();

	const applyStyles = (html: string) => {
		return `
            <style>
                body { font-family: Arial, sans-serif; }
                h1 { font-size: 2rem; color: #333; } /* text-4xl */
                h2 { font-size: 1.5rem; color: #333; } /* text-3xl */
                h3 { font-size: 1.25rem; color: #333; } /* text-2xl */
                p { font-size: 1rem; line-height: 1.5; margin: 10px 0; } /* text-base */
                ul, ol { margin: 10px 0 10px 20px; }
                li { margin: 5px 0; }
            </style>
            <body>${html}</body>
        `;
	};

	// Render HTML into the PDF
	pdf.html(applyStyles(html), {
		callback: (doc) => {
			saveAs(doc.output('blob'), 'example.pdf');
		},
		x: 10,
		y: 10
	});
}

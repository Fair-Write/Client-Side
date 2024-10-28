import type { EditorState } from 'prosemirror-state';
import { Document } from 'docx'; // Import the Document type for docx

// Define the function to export the editor state as DOCX
export async function exportStateAsDOCX(state: EditorState): Promise<void> {
	// Serialize the ProseMirror document to a DOCX format

	const { defaultDocxSerializer } = await import('prosemirror-docx');
	const { Packer } = await import('docx');
	const { saveAs } = await import('file-saver');

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const wordDocument: Document = defaultDocxSerializer.serialize(state.doc);

	// Convert the serialized document to a Blob
	const blob: Blob = (await Packer.toBlob(wordDocument)) as Blob;

	// Use FileSaver to download the file
	saveAs(blob, 'example.docx');
}

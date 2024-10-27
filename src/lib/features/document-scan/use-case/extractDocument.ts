import { getTextFromHtml } from './docxToText';
import { getTextFromImage } from './imageToText';
import { getTextFromPdf } from './pdfToText';
import { getSuffix } from './utilts';

// turn drag event into file attribute
export function convertDragToFile(e: DragEvent): File {
	// checks if the drag event contains files
	if (e.dataTransfer?.items != null) {
		return e.dataTransfer.items[0].getAsFile() as File;
	} else {
		throw new Error('NOT A FILE');
	}
}

export function convertInputToFile(e: Event): File {
	const input = e.target as HTMLInputElement;

	if (input.files) {
		return input.files[0];
	} else {
		throw new Error('NOT A FILE');
	}
}

export async function fileHandler(file: File): Promise<string> {
	// do something with the file here
	const fileSuffix = getSuffix(file.name);
	// extract file to text

	if (fileSuffix == 'pdf') {
		return await getTextFromPdf(file);
	} else if (fileSuffix == 'docx') {
		return await getTextFromHtml(file);
	} else if (fileSuffix == 'png' || fileSuffix == 'jpeg') {
		return await getTextFromImage(file);
	} else {
		throw new Error('Error has occured');
	}
}

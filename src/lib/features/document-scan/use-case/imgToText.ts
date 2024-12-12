import { createWorker, type Worker } from 'tesseract.js';

export async function ocrToText(file: File | null, language: string = 'eng'): Promise<string> {
	if (!file) {
		throw new Error('No file provided');
	}

	const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
	if (!supportedTypes.includes(file.type)) {
		throw new Error(`Unsupported file type: ${file.type}`);
	}

	let worker: Worker | null = null;
	try {
		worker = await createWorker(language);
		const { data: { text } } = await worker.recognize(file);

		return text;
	} catch (error) {
		throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	} finally {
		if (worker) {
			await worker.terminate();
		}
	}
}
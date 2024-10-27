import Tesseract, { type RecognizeResult } from 'tesseract.js';

export async function getTextFromImage(file: File): Promise<string | undefined> {
	try {
		const result: RecognizeResult = await Tesseract.recognize(file, 'eng', {
			logger: (m) => console.log(m)
		});
		console.log(result.data.text);
		return result.data.text;
	} catch (err) {
		console.error(err);
		return undefined;
	}
}

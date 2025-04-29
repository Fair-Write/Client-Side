import * as PDFJS from 'pdfjs-dist';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';

// Set worker source
PDFJS.GlobalWorkerOptions.workerSrc = import.meta.url + 'pdfjs-dist/build/pdf.worker.mjs';

function filterTokenizedText(items: PDFJS.TextItem[]) {
	const lines: { y: number; text: string }[] = [];

	const cleanText = (str: string) => {
		// Remove emoji-like characters and unreadable artifacts
		return str
			.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
			.replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
			.replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
			.replace(/[\u{2600}-\u{26FF}]/gu, '') // Misc symbols
			.replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
			.replace(/[�]/g, '') // Specific weird artifacts you encountered
			.replace(/\s+/g, ' ') // Normalize multiple spaces
			.trim();
	};

	items.forEach((item) => {
		const rawText = item.str;
		const cleaned = cleanText(rawText);

		if (!cleaned) return; // Skip if now empty after cleaning

		const y = item.transform[5] as number;

		const line = lines.find((l) => Math.abs(l.y - y) < 2);

		if (line) {
			line.text += ' ' + cleaned;
		} else {
			lines.push({ y, text: cleaned });
		}
	});

	return lines
		.sort((a, b) => b.y - a.y) // Top to bottom
		.map((line) => `<p>${line.text}</p>`)
		.join('\n');
}

const getPageText = async (pdf: PDFJS.PDFDocument, pageNo: number) => {
	const page = await pdf.getPage(pageNo);
	const tokenizedText = await page.getTextContent();
	console.log('TEXT', tokenizedText);

	return filterTokenizedText(tokenizedText.items);
};

export async function getTextFromPDF(file: File | null) {
	if (!file) {
		throw new Error('File not found');
	}

	if (file.type !== 'application/pdf') {
		throw new Error('Invalid PDF type');
	}

	const getPDFText = async (source: ArrayBuffer): Promise<string> => {
		// Use configuration options when loading document
		const pdf = await PDFJS.getDocument({
			data: new Uint8Array(source),
			disableTextLayer: true, // Use configuration option here
			isEvalSupported: false,
			useSystemFonts: true
		}).promise;

		const maxPages = pdf.numPages;
		const pageTextPromises = [];
		for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			pageTextPromises.push(getPageText(pdf, pageNo));
		}
		const pageTexts = await Promise.all(pageTextPromises);
		return pageTexts.join(' ');
	};

	try {
		const pdfBuffer = await file.arrayBuffer();

		return await getPDFText(pdfBuffer);
	} catch (err) {
		throw new Error(`Could not get PDF text from PDF: ${err}`);
	}
}

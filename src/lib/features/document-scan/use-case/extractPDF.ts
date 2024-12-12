import * as PDFJS from 'pdfjs-dist';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';

// Set worker source
PDFJS.GlobalWorkerOptions.workerSrc = import.meta.url + 'pdfjs-dist/build/pdf.worker.mjs';

export async function getTextFromPDF(file: File | null) {
	if (!file) {
		throw new Error('File not found');
	}

	if (file.type !== 'application/pdf') {
		throw new Error('Invalid PDF type');
	}

	const getPageText = async (pdf: PDFJS.PDFDocument, pageNo: number) => {
		const page = await pdf.getPage(pageNo);
		const tokenizedText = await page.getTextContent();

		return tokenizedText.items.map((token) => token.str).join('');
	};

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

import * as PDFJS from 'pdfjs-dist';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';

// Set worker source
PDFJS.GlobalWorkerOptions.workerSrc = import.meta.url + 'pdfjs-dist/build/pdf.worker.mjs';

import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file) {
		return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
	}

	if (file.type !== 'application/pdf') {
		return new Response(JSON.stringify({ error: 'Uploaded file is not a valid PDF file' }), {
			status: 400
		});
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
		const results = await getPDFText(pdfBuffer);

		return new Response(JSON.stringify({ data: results }), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
	}
};

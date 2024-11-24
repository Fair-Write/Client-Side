import { PDFExtract, type PDFExtractOptions, type PDFExtractResult } from 'pdf.js-extract';
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

	const pdfExtract = new PDFExtract();
	const options: PDFExtractOptions = {}; // specify options as needed
	const arrayBuffer = await file.arrayBuffer();
	const bufferDocx = Buffer.from(arrayBuffer);

	try {
		const data: PDFExtractResult = await new Promise((resolve, reject) => {
			pdfExtract.extractBuffer(bufferDocx, options, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data as PDFExtractResult);
				}
			});
		});

		const allPagesContent = await data.pages
			.map((page) => page.content.reduce((acc, curr) => acc + curr.str, ''))
			.join('\n');

		return new Response(JSON.stringify({ data: allPagesContent }), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
	}
};

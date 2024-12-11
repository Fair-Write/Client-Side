import { getDocument } from 'pdfjs-dist';
import {
	type DocumentInitParameters,
	PDFDataRangeTransport,
	type TypedArray
} from 'pdfjs-dist/types/src/display/api';

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

	const getPdfText = async (
		src: DocumentInitParameters | PDFDataRangeTransport | TypedArray
	): Promise<string> => {
		const pdf = await getDocument(src).promise;

		const pageList = await Promise.all(
			Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1))
		);

		const textList = await Promise.all(pageList.map((p) => p.getTextContent()));

		return textList.map(({ items }) => items.map(({ str }) => str).join('')).join('');
	};
	const pdfSource = file.arrayBuffer().then((ab: ArrayBuffer) => {
		return Buffer.from(ab);
	});
	const results = getPdfText(await pdfSource);
	console.log(results);

	try {
		return new Response(JSON.stringify({ data: await results }), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
	}
};

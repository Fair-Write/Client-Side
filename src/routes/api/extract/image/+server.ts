import { type RequestHandler } from '@sveltejs/kit';

import Tesseract from "tesseract.js";

export const POST: RequestHandler = async ({ request }) => {

	const payload = await request.formData();

	const file = payload.get('file') as File;

	if (!file) {
		return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
	}

	// Check the file if it is a jpg or png
	if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
		return new Response(JSON.stringify({ error: 'Uploaded file is not a valid image file' }), {
			status: 400
		});
	}
	try {
		const arrayBuffer = await file.arrayBuffer();
		const bufferDocx = Buffer.from(arrayBuffer);
		const worker = await	Tesseract.createWorker("eng");
		const {
			data: { text }
		} = await worker.recognize(bufferDocx);
		return new Response(JSON.stringify({ message: text }), { status: 200 });
	} catch (e) {
		return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
	}
};

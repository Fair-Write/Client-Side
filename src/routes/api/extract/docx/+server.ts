import { type RequestHandler } from '@sveltejs/kit';
import mammoth from 'mammoth';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file) {
		return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
	}

	if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
		return new Response(JSON.stringify({ error: 'Uploaded file is not a valid DOCX file' }), {
			status: 400
		});
	}

	try {
		const arrayBufferDocx = await file.arrayBuffer();
		const bufferDocx = Buffer.from(arrayBufferDocx);
		const conversion = await mammoth.extractRawText({ buffer: bufferDocx });

		return new Response(JSON.stringify({ data: conversion.value }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Conversion Error', error);
		return new Response(JSON.stringify({ error: 'Conversion Failed' }), { status: 500 });
	}
};

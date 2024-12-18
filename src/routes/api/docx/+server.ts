import type { RequestHandler } from '@sveltejs/kit';
import htmlToDocx from 'html-to-docx';

export const POST: RequestHandler = async ({ request }) => {
	// 1. Get HTML content from the request body
	const { htmlContent } = await request.json();

	try {
		// 2. Convert HTML to docx
		const docxBuffer = await htmlToDocx(htmlContent, "", {
			table: { row: { cantSplit: true } },
			footer: true,
			pageNumber: true,
		});

		// 3. Set response headers for file download
		return new Response(docxBuffer, {
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'Content-Disposition': 'attachment; filename=document.docx'
			}
		});
	} catch (error) {
		console.error("Error generating docx:", error);
		return new Response("Failed to generate docx", { status: 500 });
	}
};
// src/routes/api/verify-admin/+server.ts
import { json } from '@sveltejs/kit';
import { ADMIN_PASSWORD } from '$env/static/private';
import type { RequestHandler } from './$types';

interface RequestBody {
	password: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { password }: RequestBody = await request.json();

		// Verify the password against the environment variable
		if (password === ADMIN_PASSWORD) {
			return json({ success: true });
		} else {
			return json({ success: false }, { status: 401 });
		}
	} catch {
		return json({ success: false, error: 'Invalid request' }, { status: 400 });
	}
};

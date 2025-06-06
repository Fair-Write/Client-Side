import { countStore } from '$lib/stores/countStore';

const url = import.meta.env.VITE_BACKEND_URL || 'NOTHING';

export async function getCount() {
	try {
		const response = await fetch(url + 'count', {
			method: 'GET',
			headers: {
				'ngrok-skip-browser-warning': 'true',
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText}`);
		}

		const contentType = response.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			const text = await response.text();
			console.log(text);
			throw new Error(`Expected JSON, got: ${contentType}. Response: ${text}`);
		}

		const data = await response.json();

		countStore.set(await data.count);
	} catch (error) {
		if (error instanceof SyntaxError) {
			console.error('Invalid JSON response');
		}
		throw error;
	}
}

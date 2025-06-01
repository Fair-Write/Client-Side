import { listStore, refreshStore } from '$lib/stores/refreshStore';
import { get } from 'svelte/store';
import type { TGenderTermProcessed } from './column';
import { toast } from 'svelte-sonner';

const url = import.meta.env.VITE_BACKEND_URL || 'NOTHING';

type TermsResponse = { [key: string]: string[] };

export async function getList(): Promise<TermsResponse> {
	console.log(url);
	try {
		const response = await fetch(url + 'terms', {
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

		return (await response.json()) as TermsResponse;
	} catch (error) {
		if (error instanceof SyntaxError) {
			console.error('Invalid JSON response');
		}
		throw error;
	}
}

export async function postListBulk() {
	console.log(url);
	try {
		const response = await fetch(url + 'terms', {
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

		return (await response.json()) as TermsResponse;
	} catch (error) {
		if (error instanceof SyntaxError) {
			console.error('Invalid JSON response');
		}
		throw error;
	}
}

export async function postBulkList(request: TGenderTermProcessed[]): Promise<TermsResponse> {
	const sanitizedRequest = request.reduce(
		(acc, item) => {
			acc[item.term] = item.alternatives.split(',');
			return acc;
		},
		{} as Record<string, string[]>
	);

	const oldTerms = get(listStore).reduce(
		(acc, item) => {
			acc[item.term] = item.alternatives.split(',');
			return acc;
		},
		{} as Record<string, string[]>
	);

	const combineRecord: Record<string, string[]> = { ...oldTerms, ...sanitizedRequest };

	const response = await fetch(url + 'terms/bulk', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(combineRecord)
	});

	if (!response.ok) {
		toast.error('Error Occured Please Check Logs');
		throw new Error(`HTTP error! status: ${response.status}`);
	} else {
		toast.success('Success');
		refreshStore.set(get(refreshStore) + 1);
	}

	return response.json() as Promise<TermsResponse>;
}

export async function putList(term: string, options: string): Promise<TermsResponse> {
	const sanitizedOptions = options.split(',');
	const response = await fetch(url + 'terms/' + term, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ options: sanitizedOptions })
	});
	if (!response.ok) {
		toast.error('Error Occured Please Check Logs');
		throw new Error(`HTTP error! status: ${response.status}`);
	} else {
		toast.success('Success');
		refreshStore.set(get(refreshStore) + 1);
	}
	console.log(sanitizedOptions);

	return response.json() as Promise<TermsResponse>;
}

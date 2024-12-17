import { textContent } from '$lib/stores/textFromEditorStore';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
import { aiSuggestions } from '$lib/stores/lintingStore';
import { progressStore } from '$lib/stores/progressStore';
import { get } from 'svelte/store';
import { GLFScore } from '$lib/stores/omegaLOL';
// import axiosInstance from '../../../../service/axios';
import { toast } from 'svelte-sonner';
function isStringOrArrayOfStrings(value: string | string[]) {
	if (typeof value === 'string') {
		return value; // It's a string
	}

	if (Array.isArray(value)) {
		return value[0]; // It's an array of strings
	}

	return false; // It's neither a string nor an array of strings
}

const checkUrl = () => {
	if (localStorage.getItem('url') !== undefined) {
		return localStorage.getItem('url') as string;
	} else {
		return 'http://127.0.0.1:8080';
	}
};

export async function grammarCheckService(nextSlide: () => void) {
	// FOR TESTING
	// aiSuggestions.set(		[
	// 	{
	// 		message: 'Change to plural',
	// 		originalText: 'is',
	// 		replacement: 'are',
	// 		correctionType: 'grammar',
	// 		rationale: 'lorem ipsum somethign something',
	// 		offSet: 31,
	// 		endSet: 32,
	// 		indexReplacement: 5
	// 	},
	// 	{
	// 		message: 'Change to joe biden',
	// 		originalText: 'emergency,',
	// 		replacement: 'joebiden',
	// 		correctionType: 'grammar',
	// 		rationale: 'lorem ipsum somethign something',
	// 		offSet: 31,
	// 		endSet: 32,
	// 		indexReplacement: 3
	// 	},
	// 	{
	// 		message: 'Change to donald trump',
	// 		originalText: 'lives',
	// 		replacement: 'donald trump',
	// 		correctionType: 'grammar',
	// 		rationale: 'lorem ipsum somethign something',
	// 		offSet: 31,
	// 		endSet: 32,
	// 		indexReplacement: 12
	// 	}
	// ]);
	//
	// progressStore.set(50);
	// nextSlide();

	// FOR DEPLOYMENT
	try {
		const post = await fetch('https://x3lkcvjr-8080.asse.devtunnels.ms/grammar', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ prompt: get(textContent) })
		});

		// const post = axiosInstance.post(`https://x3lkcvjr-8080.asse.devtunnels.ms//grammar`, {
		// 	body: JSON.stringify({ prompt: get(textContent) })
		// });

		// const data = await post;
		const data = await post.json();
		console.log(data);
		if (Object.keys(data).length !== 0) {
			const suggestions: Promise<TSuggestion[]> = data.corrections.map(
				(correction: {
					word_index: number;
					character_offset: number;
					character_endset: number;
					original_text: string;
					message: string;
					replacements: string[];
				}) => ({
					indexReplacement: correction.word_index,
					originalText: correction.original_text,
					offSet: correction.character_offset,
					endSet: correction.character_endset,
					replacement: isStringOrArrayOfStrings(correction.replacements),
					correctionType: 'grammar',
					message: correction.message,
					rational: ''
				})
			);

			aiSuggestions.set(await suggestions);
			nextSlide();
			progressStore.set(50);
		} else {
			nextSlide();
			progressStore.set(50);
		}
	} catch (error) {
		toast.error('Network Error');
		console.error('Error:', error);
	}
}

export async function glfCheckService(nextSlide: () => void) {
	// For Testing
	// setTimeout(() => {
	// 	$aiSuggestions = [
	// 		{
	// 			message: 'Change to firefighter',
	// 			originalText: 'firemen',
	// 			replacement: 'firefighter',
	// 			correctionType: 'gfl',
	// 			offSet: 23,
	// 			endSet: 29,
	// 			indexReplacement: 4,
	// 			rationale: 'lorem ipsum somethign something'
	// 		}
	// 	];
	// }, 500);
	// nextSlide();
	// $progressStore = 100;
	try {
		const post = await fetch('https://x3lkcvjr-8080.asse.devtunnels.ms/gfl', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: get(textContent)
			})
		});

		// const post = axiosInstance.post(`${checkUrl()}/grammar`, {
		// 	body: JSON.stringify({ prompt: get(textContent) })
		// });

		// const data = await post;
		const data = await post.json();
		console.log(data);
		if (Object.keys(data).length !== 0) {
			const suggestions: Promise<TSuggestion[]> = data.corrections.map(
				(correction: {
					word_index: number;
					character_offset: number;
					character_endset: number;
					original_text: string;
					message: string;
					replacements: string[] | string;
				}) => ({
					indexReplacement: correction.word_index,
					originalText: correction.original_text,
					offSet: correction.character_offset,
					endSet: correction.character_endset,
					replacement: isStringOrArrayOfStrings(correction.replacements),
					correctionType: 'gfl',
					message: 'Gender Fair Language',
					rational: ''
				})
			);

			GLFScore.set((await suggestions).length);

			aiSuggestions.set(await suggestions);
			nextSlide();
			progressStore.set(100);
		} else {
			progressStore.set(100);
			nextSlide();
		}
	} catch (error) {
		toast.error('Network Error');

		console.error('Error:', error);
	}
}

import { textContent } from '$lib/stores/textFromEditorStore';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
import { aiSuggestions } from '$lib/stores/lintingStore';
import { progressStore } from '$lib/stores/progressStore';
import { toast } from 'svelte-sonner';
import { get } from 'svelte/store';
import { GLFScore } from '$lib/stores/omegaLOL';
function isStringOrArrayOfStrings(value: string | string[]) {
	if (typeof value === 'string') {
		return value; // It's a string
	}

	if (Array.isArray(value)) {
		return value[0]; // It's an array of strings
	}

	return false; // It's neither a string nor an array of strings
}

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
		const post = await fetch('http://127.0.0.1:8080/grammar', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ prompt: get(textContent) })
		});

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
		toast.error('An Error Has Occured');
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
		const post = await fetch('http://127.0.0.1:8080/gfl', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: get(textContent)
			})
		});

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
		console.error('Error:', error);
		toast.error('An Error Has Occured');
	}
}

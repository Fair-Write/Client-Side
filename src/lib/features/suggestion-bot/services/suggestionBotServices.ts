import { textContent } from '$lib/stores/textFromEditorStore';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
import { aiSuggestions } from '$lib/stores/lintingStore';
import { progressStore } from '$lib/stores/progressStore';
import { get } from 'svelte/store';
import { GLFScore } from '$lib/stores/omegaLOL';
import { revisedTextStore } from '$lib/stores/revisedTextStore';
// import axiosInstance from '../../../../service/axios';
import { toast } from 'svelte-sonner';
import { preferenceStore } from '$lib/stores/preferenceStore';

// this may be the culprit

const url = import.meta.env.VITE_BACKEND_URL || 'NOTHING';

function isStringOrArrayOfStrings(value: string | string[]) {
	if (Array.isArray(value)) {
		// If it's an array, use the first element
		return value[0];
	}
	// Otherwise, it's a string, return it directly
	return value;
}

// const checkUrl = () => {
// 	if (localStorage.getItem('url') !== undefined) {
// 		return localStorage.getItem('url') as string;
// 	} else {
// 		return 'http`://127.0.0.1:8080';
// 	}
// };

export async function grammarCheckService(nextSlide: () => void) {
	console.log(url);
	// FOR TESTING
	// aiSuggestions.set([
	// 	{
	// 		message: 'Change to plural',
	// 		originalText: 'firemen',
	// 		replacement: 'firefighter',
	// 		correctionType: 'grammar',
	// 		rationale: 'lorem ipsum somethign something',
	// 		offSet: 23,
	// 		endSet: 30,
	// 		indexReplacement: 5
	// 	}
	// ]);

	// progressStore.set(50);
	// nextSlide();

	// FOR DEPLOYMENT

	try {
		const post = await fetch(`${url}grammar`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ prompt: get(textContent) })
		});

		const data = await post.json();
		console.log(data);
		await revisedTextStore.set(data.revised_text as string);
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
	console.log(url);
	localStorage.getItem('preferences');
	// For Testing
	// setTimeout(() => {
	// 	aiSuggestions.set([
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
	// 	]);

	// 	GLFScore.set(60);
	// }, 500);
	// nextSlide();
	// progressStore.set(100);

	// JSON.parse(localStorage.getItem('preferences') as string)
	const preferenceList = () => {
		if (get(preferenceStore).length === 0) {
			return { Nyala: 'gender_fair' };
		} else {
			const preferences = JSON.parse(
				localStorage.getItem('preferences') || `{"Nyala": "gender_fair"}`
			) as {
				name: string;
				pronoun: string;
			}[];

			const preferenceMap = preferences.reduce(
				(acc: { [key: string]: string }, element: { name: string; pronoun: string }) => {
					acc[element.name] = element.pronoun;
					return acc;
				},
				{}
			);

			if (Object.keys(preferenceMap).includes('') || preferenceMap[''] == '')
				return { Nyala: 'gender_fair' };

			return preferenceMap;
		}
	};

	console.log('preference', preferenceList());

	// For Deployment
	try {
		const post = await fetch(`${url}gfl`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: get(textContent),
				pronoun_map: preferenceList()
			})
		});

		const data = await post.json();

		await revisedTextStore.set(data.revised_text as string);

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

			console.log(data.revised_text);
			console.log(data, 'hello');
		} else {
			progressStore.set(100);
			nextSlide();
		}
	} catch (error) {
		toast.error('Network Error');
		console.error('Error:', error);
	}
}

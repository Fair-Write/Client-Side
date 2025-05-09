import { textContent } from '$lib/stores/textFromEditorStore';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';
import { aiSuggestions } from '$lib/stores/lintingStore';
import { progressStore } from '$lib/stores/progressStore';
import { get } from 'svelte/store';
import { revisedTextStore } from '$lib/stores/revisedTextStore';
import { toast } from 'svelte-sonner';
import { preferenceStore } from '$lib/stores/preferenceStore';

const url = import.meta.env.VITE_BACKEND_URL || 'NOTHING';

export async function grammarCheckService(nextSlide: () => void) {
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
					replacements: [...correction.replacements],
					correctionType: 'grammar',
					chosenReplacement: '',
					message: correction.message,
					rational: ''
				})
			);

			aiSuggestions.set(await suggestions);
			console.log('suggestions', suggestions);

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
	const preferenceList = () => {
		// if any preference is empty roll back to this one
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

			// if any preference is an empty string roll back to this one
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
		console.log('data', data);

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
					replacements: [...correction.replacements],
					correctionType: 'gfl',
					chosenReplacement: '',
					message: 'Gender Fair Language',
					rational: ''
				})
			);
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

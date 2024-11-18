import { derived } from 'svelte/store';
import { writable } from 'svelte/store';
import type { TSuggestion } from '../features/suggestion-bot/entities/suggestions';

export function omitObject<T extends TSuggestion, K extends keyof T>(
	obj: T,
	...props: K[]
): Omit<T, K> {
	const result = { ...obj };
	props.forEach((prop) => {
		delete result[prop];
	});
	return result;
}

export const aiSuggestions = writable<TSuggestion[]>([]);

export const linterStore = derived(aiSuggestions, ($aiSuggestions) => {
	console.log("TEST");
	return $aiSuggestions.map((aiSuggestion) =>
		omitObject(aiSuggestion, 'correctPhrase', 'analysis', 'heading')
	);
});

export const replaceStore = writable<
	Omit<TSuggestion, 'analysis' | 'correctionType' | 'heading'>[]
>([]);

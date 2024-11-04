import { derived } from 'svelte/store';
import { writable } from 'svelte/store';
import type { TSuggestion } from '$lib/features/suggestion-bot/entities/suggestions';


function omitObject<T extends TSuggestion, K extends keyof T>(obj: T, ...props: K[]): Omit<T, K> {
	const result = { ...obj };
	props.forEach((prop) => {
		delete result[prop];
	});
	return result;
}

export const aiSuggestions = writable<TSuggestion[]>([
	{ wrongPhrase: 'foo', correctPhrase: 'bar', correctionType: 'grammar', analysis: 5 },
	{ wrongPhrase: 'bar', correctPhrase: 'foo', correctionType: 'gfl', analysis: 5 },
	{ wrongPhrase: 'barfoo', correctPhrase: 'foobar', correctionType: 'spelling', analysis: 5 }
]);

export const linterStore = derived(aiSuggestions, ($aiSuggestions) => {
	return $aiSuggestions.map((aiSuggestion) =>
		omitObject(aiSuggestion, 'correctPhrase', 'analysis')
	);
});

export const replaceStore = derived(aiSuggestions, ($aiSuggestions) => {
	return $aiSuggestions.map((aiSuggestion) =>
		omitObject(aiSuggestion, 'analysis', 'correctionType')
	);
});

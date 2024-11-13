import { derived } from 'svelte/store';
import { writable } from 'svelte/store';
import type { TSuggestion } from '../features/suggestion-bot/entities/suggestions'

export function omitObject<T extends TSuggestion, K extends keyof T>(obj: T, ...props: K[]): Omit<T, K> {
	const result = { ...obj };
	props.forEach((prop) => {
		delete result[prop];
	});
	return result;
}

export const aiSuggestions = writable<TSuggestion[]>([
	{ wrongPhrase: 'doesn\'t', correctPhrase: 'don\'t', correctionType: 'grammar', analysis: 5 },
	{ wrongPhrase: 'self-esteam', correctPhrase: 'self-esteem', correctionType: 'spelling', analysis: 5 },
	{ wrongPhrase: 'collegues', correctPhrase: 'colleagues', correctionType: 'spelling', analysis: 5 },
	{ wrongPhrase: 'his', correctPhrase: 'their', correctionType: 'gfl', analysis: 5 },
	{ wrongPhrase: 'he', correctPhrase: 'they', correctionType: 'gfl', analysis: 5 },
	{ wrongPhrase: 'responsabilities', correctPhrase: 'responsibilities', correctionType: 'spelling', analysis: 5 }
]);

export const linterStore = derived(aiSuggestions, ($aiSuggestions) => {
	return $aiSuggestions.map((aiSuggestion) =>
		omitObject(aiSuggestion, 'correctPhrase', 'analysis')
	);
});

export const replaceStore = writable<Omit<TSuggestion, 'analysis'|'correctionType'>[]>([]);

import { writable } from 'svelte/store';

export const ignoreGrammarStore = writable<string[]>([]);

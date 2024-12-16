import { writable } from 'svelte/store';
import { type TformSchema } from '$lib/features/suggestion-bot/entities/formSchema';

export let preferenceStore = writable<TformSchema[]>([{ name: '', pronoun: '' }]);

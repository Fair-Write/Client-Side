import { writable } from 'svelte/store';
import type { TSuggestion } from '../features/suggestion-bot/entities/suggestions';

export const aiSuggestions = writable<TSuggestion[]>([]);
export const replaceStore = writable<TSuggestion[]>([]);

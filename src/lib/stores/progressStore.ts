import { writable } from 'svelte/store';

export const progressStore = writable<number>(0)
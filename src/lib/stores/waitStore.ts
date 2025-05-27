import { writable } from 'svelte/store';

export const waitStore = writable<boolean>(false);

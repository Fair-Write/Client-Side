import { writable } from 'svelte/store';
import type { TGenderTermProcessed } from '../../routes/admin/column';

export const refreshStore = writable<number>(0);
export const listStore = writable<TGenderTermProcessed[]>([]);

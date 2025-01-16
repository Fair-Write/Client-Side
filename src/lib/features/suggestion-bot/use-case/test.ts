import { textContent } from '$lib/stores/textFromEditorStore';
import { get } from 'svelte/store';

export function foobar() {
	return get(textContent);
}

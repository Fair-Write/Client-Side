import type { LayoutServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/features/suggestion-bot/entities/formSchema';
import { zod } from 'sveltekit-superforms/adapters';

export const load: LayoutServerLoad = async () => {
	return {
		form: await superValidate(
			{
				payload: [{ Name: '', Pronoun: '' }]
			},
			zod(formSchema)
		)
	};
};

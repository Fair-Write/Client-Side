import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(formSchema));

	// Optional: Log the initial form state
	console.log('Initial form loaded:', form);

	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		// Log the raw form data
		const formData = await event.request.formData();
		console.log('Raw form data received:', Object.fromEntries(formData));

		// Validate the form
		const form = await superValidate(event, zod(formSchema));

		// Log validation results
		console.log('Form validation result:', {
			valid: form.valid,
			data: form.data,
			errors: form.errors
		});

		if (!form.valid) {
			console.log('Form validation failed:', form.errors);
			return fail(400, {
				form
			});
		}

		// Log successful form data
		console.log('Form submitted successfully with data:', form.data);

		// Here you would typically save to database, send email, etc.
		// Example:
		// await saveTermToDatabase(form.data.term, form.data.alternatives);

		return {
			form
		};
	}
};

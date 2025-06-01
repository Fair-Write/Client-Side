import { z } from 'zod';

export const formSchema = z.object({
	term: z.string().min(1, 'Required'),
	alternatives: z.string().min(1, 'Required')
});

export type FormSchema = typeof formSchema;

import { z } from 'zod';

const schemaBase = z.object({
	Name: z.string().min(2).max(50),
	Pronoun: z.string().min(2).max(50)
});

export const formSchema = z.object({
	payload: z.array(schemaBase)
});

export type FormSchema = (typeof formSchema);

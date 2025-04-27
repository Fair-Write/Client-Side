import { inputRules, wrappingInputRule } from 'prosemirror-inputrules';
import type { Schema } from 'prosemirror-model';
export function buildInputRules(schema: Schema) {
	const rules = [];

	const bulletListRule = wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bullet_list);
	const orderedListRule = wrappingInputRule(/^(\d+)\.\s$/, schema.nodes.ordered_list, (match) => ({
		order: +match[1]
	}));

	rules.push(bulletListRule, orderedListRule);

	return inputRules({ rules });
}

export type TSuggestion = {
	indexReplacement: number;
	originalText: string;
	offSet: number;
	endSet: number;
	replacements: string[];
	chosenReplacement: string;
	correctionType: 'grammar' | 'spelling' | 'gfl';
	message: string;
	rationale: string;
};

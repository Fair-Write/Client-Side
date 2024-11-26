export type TSuggestion = {
	originalText: string;
	indexReplacement:number;
	offSet:number;
	replacement: string;
	correctionType: 'grammar' | 'spelling' | 'gfl';
	message: string;
	rationale: string;
};

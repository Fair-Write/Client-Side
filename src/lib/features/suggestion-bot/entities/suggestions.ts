export type TSuggestion = {
	indexReplacement:number;
	originalText: string;
	offSet:number;
	endSet:number;
	replacement: string;
	correctionType: 'grammar' | 'spelling' | 'gfl';
	message: string;
	rationale: string;
};

export type TSuggestion = {
	wrongPhrase: string;
	correctPhrase: string;
	correctionType: 'grammar' | 'spelling' | 'gfl';
	heading:string;
	analysis: number;
};

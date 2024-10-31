export type SuggestionResult = {
	errorType: 'grammar' | 'spelling' | 'gfl';
	incorrectTerm: string;
	suggestedTerm: string;
	explanation: string;
};

export type SuggestionAnalysis = {
	suggestionResults: SuggestionResult[];
	totalIncorrectGFL: number;
	totalCorrectGFL: number;
};

export type ScoreAnalysis = Map<string, number>;

// what i need
// so i need to get the result of the scan form the api
// then after geting i will need the option to perform an action that will
// manipulate the payload that i got from the api

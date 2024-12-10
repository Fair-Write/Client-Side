import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function getWordIndices(
	sentence: string,
	wordIndex: number
): { start: number; end: number } | null {
	const words = sentence.split(/\s+/); // Split the sentence into words by whitespace
	if (wordIndex < 0 || wordIndex >= words.length) {
		return null; // Return null if the word index is out of bounds
	}

	let currentIndex = 0; // Keep track of the current index in the original sentence

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		const wordStart = sentence.indexOf(word, currentIndex);
		const wordEnd = wordStart + word.length - 1;

		if (i === wordIndex) {
			return { start: wordStart, end: wordEnd };
		}

		currentIndex = wordEnd + 1; // Move the current index past the current word
	}

	return null; // This shouldn't be reached under normal circumstances
}

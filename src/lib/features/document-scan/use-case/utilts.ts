// Utils function
export function getSuffix(fileName: string): 'pdf' | 'docx' | 'jpeg' | 'png' | 'jpg' {
	const lookUpTable = ['pdf', 'docx', 'jpeg', 'png', 'jpg'] as const;
	let suffix: (typeof lookUpTable)[number] | undefined;

	// Checks if the fileName has the correct suffix
	lookUpTable.forEach((format) => {
		if (fileName.endsWith(`.${format}`)) {
			// Use `endsWith` for stricter matching
			suffix = format;
		}
	});

	// Validate suffix
	if (!suffix) {
		throw new Error('Invalid File Type');
	}

	return suffix;
}

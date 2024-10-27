// utils function
export function getSuffix(fileName: string): 'pdf'| 'docx'|  'jpeg'| 'png' {
	const lookUpTable = ['pdf', 'docx',  'jpeg', 'png'] as const;
  let suffix: typeof lookUpTable[number] | undefined;

  // Checks if the fileName has the correct suffix
  lookUpTable.forEach((format) => {
    if (fileName.endsWith(`.${format}`)) { // Use `endsWith` for stricter matching
      suffix = format;
    }
  });

  // Validate suffix
  if (!suffix) {
    throw new Error('Invalid File Type');
  }

  return suffix;

}

// Helper function to read the file as an ArrayBuffer
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		// Resolve the promise once the file is read
		reader.onload = () => resolve(reader.result as ArrayBuffer);

		// Reject the promise if there's an error
		reader.onerror = () => reject(reader.error);

		// Read the file as ArrayBuffer
		reader.readAsArrayBuffer(file);
	});
}

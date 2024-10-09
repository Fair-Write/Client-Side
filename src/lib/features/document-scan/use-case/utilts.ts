// utils function
export function getSuffix(fileName: string): string {
  const lookUpTable = ["pdf", "doc", "docx", "xml", "html"];
  let suffix = "";
  // checks if the fileName has the right suffix
  lookUpTable.forEach((format) => {
    if (fileName.includes(format)) {
      suffix = format;
    }
  });

  //   validate the suffix
  if (lookUpTable.includes(suffix) == false) {
    throw new Error("Invalid File Type");
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

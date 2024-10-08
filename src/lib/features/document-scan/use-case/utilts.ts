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

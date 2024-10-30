import { readFileAsArrayBuffer } from "./utilts";
import mammoth from "mammoth";

export async function getTextFromHtml(file: File): Promise<string> {
  try {
    const arrayBufferDocx = await readFileAsArrayBuffer(file);
    const conversion = await mammoth.convertToHtml({
      arrayBuffer: arrayBufferDocx,
    });

    return conversion.value;
  } catch (error) {
    console.error("Error while processing PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

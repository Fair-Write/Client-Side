import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as pdfWorker from "pdfjs-dist/build/pdf.worker.mjs";
// adding globalwork for this dogshit library
pdfjs.GlobalWorkerOptions.workerSrc =
  import.meta.url + "pdfjs-dist/build/pdf.worker.mjs";
// types
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { readFileAsArrayBuffer } from "./utilts";

export async function getTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const maxPages = pdf.numPages;
    const textPromises: string[] = [];

    // iterate on every page of the document
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .filter(isTextItem) // type guarded
        .map((item: TextItem) => item.str)
        .join("");

      textPromises.push(pageText);
    }

    const texts = await Promise.all(textPromises);
    return texts.join("");
  } catch (error) {
    console.error("Error while processing PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// Type Guard Function turns the items as TextItem
function isTextItem(item: unknown): item is TextItem {
  return (item as TextItem).str !== undefined;
}

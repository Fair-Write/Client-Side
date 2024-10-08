/* eslint-disable @typescript-eslint/no-unused-vars */
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import * as pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
pdfjs.GlobalWorkerOptions.workerSrc =
  import.meta.url + "pdfjs-dist/legacy/build/pdf.worker.mjs";

export async function getTextFromPdf(pdfPath: string): Promise<string> {
  const loadingTask = pdfjs.getDocument(pdfPath);
  const pdf = await loadingTask.promise;

  const maxPages = pdf.numPages;
  const textPromises: Promise<string>[] = [];

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: TextItem) => item.str)
      .join("");
    textPromises.push(Promise.resolve(pageText));
  }

  const texts = await Promise.all(textPromises);
  return texts.join("");
}

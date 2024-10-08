import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import * as pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs";
pdfjs.GlobalWorkerOptions.workerSrc =
  import.meta.url + "pdfjs-dist/legacy/build/pdf.worker.mjs";

export function getTextFromPdf() {
  let pdf = pdfjs.getDocument("/LoremText.pdf");

  return pdf.promise.then(function (pdf) {
    // get all pages text
    const maxPages = pdf._pdfInfo.numPages;
    let countPromises = []; // collecting all page promises
    for (let j = 1; j <= maxPages; j++) {
      let page = pdf.getPage(j);

      let txt = "";
      countPromises.push(
        page.then(function (page) {
          // add page promise
          let textContent = page.getTextContent();

          return textContent.then(function (text) {
            // return content promise
            return text.items
              .map(function (s) {
                return s.str;
              })
              .join(""); // value page text
          });
        }),
      );
    }
    // Wait for all pages and join text
    return Promise.all(countPromises).then(function (texts) {
      return texts.join("");
    });
  });
}

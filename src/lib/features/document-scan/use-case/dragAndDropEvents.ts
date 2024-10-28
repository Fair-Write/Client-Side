// turn input event to file

import {
  convertDragToFile,
  convertInputToFile,
  fileHandler,
} from "./extractDocument";

export function dragOverHandler(e: Event): void {
  e.preventDefault();
  console.log("File(s) in drop zone");
  return;
  // Prevent default behavior (Prevent file from being opened)
}

export async function dropHandler(e: DragEvent) {
  e.preventDefault();
  const file = convertDragToFile(e );
 console.log(fileHandler(file));
  return await fileHandler(file);
}

export async function inputHandler(e: Event) {
  e.preventDefault();
  const inputFile: File = convertInputToFile(e);
  console.log(fileHandler(inputFile));
  return await fileHandler(inputFile);
}

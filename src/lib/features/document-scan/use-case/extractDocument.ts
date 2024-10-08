import { getSuffix } from "./utilts";

// turn drag event into file attribute
export function convertDragToFile(e: DragEvent): File {
  // checks if the drag event contains files
  if (e.dataTransfer?.items != null) {
    return e.dataTransfer.items[0].getAsFile() as File;
  } else {
    throw new Error("NOT A FILE");
  }
}

// turn input event to file
export function convertInputToFile(e: Event): File {
  const input = e.target as HTMLInputElement;

  if (input.files) {
    return input.files[0];
  } else {
    throw new Error("NOT A FILE");
  }
}

export function dragOverHandler(ev: Event): void {
  console.log("File(s) in drop zone");
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

export function dropHandler(file: File) {
  // do something with the file here
  let fileSuffix = getSuffix(file.name);
  console.log(fileSuffix);
}

function getSuffix(fileName: string) {
  //  continue where you left off
  fileName.at(fileName.length - 4);
}

export function dropHandler(e: DragEvent) {
  console.log("File has been dropped");
  e.preventDefault();

  if (e.dataTransfer!.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...e.dataTransfer!.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        console.log(`… file[${i}].name = ${file!.name}`);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...e.dataTransfer!.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}

export function dragOverHandler(ev: Event) {
  console.log("File(s) in drop zone");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}


// turn drag event into file attribute
export function convertDragToFile(e: DragEvent): File {
	// checks if the drag event contains files
	if (e.dataTransfer?.items != null) {
		return e.dataTransfer.items[0].getAsFile() as File;
	} else {
		throw new Error('NOT A FILE');
	}
}

export function convertInputToFile(e: Event): File {
	const input = e.target as HTMLInputElement;

	if (input.files) {
		return input.files[0];
	} else {
		throw new Error('NOT A FILE');
	}
}



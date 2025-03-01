import jsPDF from 'jspdf';
import { textTitle } from '$lib/stores/textFromEditorStore';
export function exportStateAsPDF(state: string) {
	let title: string = '';
	textTitle.subscribe((value) => {
		title = value.replace(/\.[^/.]+$/, '');
	});
	const test = `
	<div class="bg-red-500 text-left text-base font-sans *:min-h-[2em]">
	${state}
	</div>`;
	const doc = new jsPDF();

	doc.html(test, {
		callback: function (doc) {
			doc.save(title);
		},
		margin: [10, 10, 10, 10],
		autoPaging: 'text',
		x: 0,
		y: 0,
		width: 190, //target width in the PDF document
		windowWidth: 675 //window width in CSS pixels
	});
}

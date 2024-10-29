import type { EditorState } from 'prosemirror-state';
import jsPDF from 'jspdf';
export  function exportStateAsPDF(state: EditorState) {
	const doc = new jsPDF();
	doc.html(state.doc.textContent, {
		callback: function (doc) {
			doc.save('Content.pdf');
		},
		margin: [10, 10, 10, 10],
		autoPaging: 'text',
		x: 0,
		y: 0,
		width: 190, //target width in the PDF document
		windowWidth: 675 //window width in CSS pixels
	});
}

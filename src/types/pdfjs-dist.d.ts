declare module "pdfjs-dist";
export interface DocumentInitParameters {
	data?: ArrayBuffer | Uint8Array;
	url?: string;
	httpHeaders?: Record<string, string>;
	withCredentials?: boolean;
	password?: string;
	disableTextLayer?: boolean;
	isEvalSupported?: boolean;
}

type TokenText = {
	str: string;
};

type PageText = {
	items: TokenText[];
};

type PdfPage = {
	getTextContent: () => Promise<PageText>;
};

type Pdf = {
	numPages: number;
	getPage: (pageNo: number) => Promise<PdfPage>;
};

type PDFSource = Buffer | string;

// Enhanced type declarations for pdfjs-dist

declare module 'pdfjs-dist' {
	export interface PDFDocumentLoadingTask {
		promise: Promise<PDFDocument>;
	}

	export interface PDFDocument {
		numPages: number;
		getPage(pageNumber: number): Promise<PDFPage>;
	}

	export interface PDFPage {
		getTextContent(): Promise<TextContent>;
		render(params: RenderParameters): PDFRenderTask;
	}

	export interface TextContent {
		items: TextItem[];
		styles: TextStyle[];
	}

	export interface TextItem {
		str: string;
		transform: number[];
		width: number;
		height: number;
		dir: string;
	}

	export interface TextStyle {
		fontName: string;
		fontSize: number;
	}

	export interface RenderParameters {
		canvasContext: CanvasRenderingContext2D;
		viewport: PDFPageViewport;
	}

	export interface PDFPageViewport {
		width: number;
		height: number;
		scale: number;
		rotation: number;
	}

	export interface PDFRenderTask {
		promise: Promise<void>;
	}

	export function getDocument(
		src: DocumentInitParameters |
			PDFDataRangeTransport |
			TypedArray |
			ArrayBuffer |
			string
	): PDFDocumentLoadingTask;
}

declare module 'pdfjs-dist/types/src/display/api' {
	export interface DocumentInitParameters {
		data?: TypedArray | ArrayBuffer;
		url?: string;
		httpHeaders?: Record<string, string>;
		withCredentials?: boolean;
		password?: string;
	}

	export type TypedArray =
		| Int8Array
		| Uint8Array
		| Uint8ClampedArray
		| Int16Array
		| Uint16Array
		| Int32Array
		| Uint32Array
		| Float32Array
		| Float64Array;

	export class PDFDataRangeTransport {
		constructor(length: number, initialData: Uint8Array);
		addProgressiveData(chunk: Uint8Array): void;
		requestDataRange(begin: number, end: number): void;
	}
}

declare module 'pdfjs-dist/build/pdf.worker.js'; // needed in 2.3.0
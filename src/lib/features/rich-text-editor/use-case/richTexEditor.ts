import { Editor } from "@tiptap/core";
import type { TDocument, TElementTarget } from "../entities/document";
import StarterKit from "@tiptap/starter-kit";

// this is the document formatter
export default function formatDocument(
  editor: Editor,
  content: TDocument,
  element: TElementTarget
): Editor {
  return new Editor({
    element: element,
    extensions: [StarterKit],
    content: content,
    onTransaction() {
      // force re-render so `editor.isActive` works as expected
      editor = editor;
    },
  });
}

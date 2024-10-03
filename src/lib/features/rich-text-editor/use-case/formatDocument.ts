import type { Editor } from "@tiptap/core";

export type TToggleMapFunctions = Map<
  string,
  {
    chain: () => void;
    style: () => boolean;
  }
>;

export default function toggleGroupMap(editor: Editor): TToggleMapFunctions {
  return new Map([
    // heading 1
    [
      "H1",
      {
        chain: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        style: () => editor.isActive("heading", { level: 1 }),
      },
    ],

    [
      "H2",
      {
        chain: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        style: () => editor.isActive("heading", { level: 2 }),
      },
    ],
    [
      "p",
      {
        chain: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        style: () => editor.isActive("paragraph"),
      },
    ],
  ]);
}

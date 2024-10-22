import { type NodeSpec, type MarkSpec, Schema } from "prosemirror-model";

// Define node types
const nodes: { [key: string]: NodeSpec } = {
  doc: {
    content: "block+",
  },
  paragraph: {
    group: "block",
    content: "inline*",
    toDOM() {
      return ["p", 0];
    },
    parseDOM: [{ tag: "p" }],
  },
  text: {
    group: "inline",
  },
  heading: {
    attrs: { level: { default: 1 } },
    content: "inline*",
    group: "block",
    defining: true,
    toDOM(node) {
      return ["h" + node.attrs.level, 0];
    },
    parseDOM: [
      { tag: "h1", attrs: { level: 1 } },
      { tag: "h2", attrs: { level: 2 } },
      { tag: "h3", attrs: { level: 3 } },
    ],
  },
  // Add more custom nodes as needed
};

// Define mark types
const marks: { [key: string]: MarkSpec } = {
  bold: {
    toDOM() {
      return ["strong"];
    },
    parseDOM: [{ tag: "strong" }],
  },
  italic: {
    toDOM() {
      return ["em"];
    },
    parseDOM: [{ tag: "em" }],
  },
};

// Define the schema with node and mark types
export const mySchema: Schema = new Schema({ nodes, marks });

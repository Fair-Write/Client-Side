import { Schema } from 'prosemirror-model';

const mySchema = new Schema({
	nodes: {
		doc: {
			content: 'block+'
		},
		text: {
			group: 'inline'
		},
		paragraph: {
			attrs: {
				align: { default: 'left' },
				fontSize: { default: '16px' },
				fontFamily: { default: 'Arial' }
			},
			content: 'inline*',
			group: 'block',
			parseDOM: [
				{
					tag: 'p',
					getAttrs(dom) {
						return {
							align: dom.style.textAlign || 'left',
							fontSize: dom.style.fontSize || '16px',
							fontFamily: dom.style.fontFamily || 'Arial'
						};
					}
				}
			],
			toDOM(node) {
				return [
					'p',
					{
						style: `text-align: ${node.attrs.align}; font-size: ${node.attrs.fontSize}; font-family: ${node.attrs.fontFamily}; `
					},
					0
				];
			}
		},
		heading: {
			attrs: {
				level: { default: 1 },
				align: { default: 'left' },
				fontSize: { default: '24px' },
				fontFamily: { default: 'Arial' }
			},
			content: 'inline*',
			group: 'block',
			defining: true,
			parseDOM: [
				{
					tag: 'h1',
					getAttrs(dom) {
						return {
							level: 1,
							align: dom.style.textAlign || 'left',
							fontSize: dom.style.fontSize || '24px',
							fontFamily: dom.style.fontFamily || 'Arial'
						};
					}
				},
				{
					tag: 'h2',
					getAttrs(dom) {
						return {
							level: 2,
							align: dom.style.textAlign || 'left',
							fontSize: dom.style.fontSize || '20px',
							fontFamily: dom.style.fontFamily || 'Arial'
						};
					}
				},
				{
					tag: 'h3',
					getAttrs(dom) {
						return {
							level: 3,
							align: dom.style.textAlign || 'left',
							fontSize: dom.style.fontSize || '18px',
							fontFamily: dom.style.fontFamily || 'Arial'
						};
					}
				}
			],
			toDOM(node) {
				return [
					'h' + node.attrs.level,
					{
						style: `text-align: ${node.attrs.align}; font-size: ${node.attrs.fontSize}; font-family: ${node.attrs.fontFamily}; font-weight:bold;`
					},
					0
				];
			}
		}
	},
	marks: {
		bold: {
			parseDOM: [{ tag: 'strong' }, { style: 'font-weight=bold' }],
			toDOM() {
				return ['strong', 0];
			}
		},
		italic: {
			parseDOM: [{ tag: 'i' }, { style: 'font-style=italic' }],
			toDOM() {
				return ['i', 0];
			}
		},
		underline: {
			parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
			toDOM() {
				return ['u', 0];
			}
		},
		strikethrough: {
			parseDOM: [{ tag: 's' }, { style: 'text-decoration=line-through' }],
			toDOM() {
				return ['s', 0];
			}
		},
		blue: {
			parseDOM: [{ style: 'color=blue' }],
			toDOM() {
				return ['span', { style: 'color: blue' }, 0];
			}
		},
		red: {
			parseDOM: [{ style: 'color=red' }],
			toDOM() {
				return ['span', { style: 'color: red' }, 0];
			}
		},
		yellow: {
			parseDOM: [{ style: 'color=yellow' }],
			toDOM() {
				return ['span', { style: 'color: yellow' }, 0];
			}
		}
	}
});

export default mySchema;

import { toggleBlockType } from 'tiptap-commands'
import { Node } from 'tiptap'

// Map from legacy alignment values to new ones
const qAlignments = {
  'ql-align-right': 'right',
  'ql-align-left': 'left',
  'ql-align-center': 'center',
  'ql-align-justify': 'justify',
}

const toAttrs = node => {
  if (node.attrs.alignment) {
    return { style: `text-align: ${node.attrs.alignment}` }
  }
  return {}
}

/**
 * Extends original paragraph node to allow content alignment
 */
export default class Paragraph extends Node {
  get name () {
    return 'paragraph'
  }

  get schema () {
    return {
      attrs: {
        alignment: {
          default: undefined,
        },
      },
      content: 'inline*',
      group: 'block',
      draggable: false,
      parseDOM: [
        {
          tag: 'p',
          getAttrs: (node) => {
            // Covers current structure
            let alignment = node.style.textAlign
            if (alignment) {
              return { alignment }
            }

            // Covers legacy structure
            node.classList.forEach((c) => {
              alignment = alignment || qAlignments[c]
            })

            return { alignment }
          },
        },
      ],
      toDOM: (node) => [
        'p',
        toAttrs(node),
        0,
      ],
    }
  }

  commands ({ type, schema }) {
    return (attrs) => toggleBlockType(type, schema.nodes.paragraph, attrs)
  }
}

import { Link as BaseLink } from 'tiptap-extensions'

/**
 * Extends original Link node to allow custom target attr
 */
export default class Link extends BaseLink {
  get schema () {
    const base = super.schema
    return {
      ...base,
      toDOM: node => ['a', {
        ...node.attrs,
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      }, 0],
    }
  }
}

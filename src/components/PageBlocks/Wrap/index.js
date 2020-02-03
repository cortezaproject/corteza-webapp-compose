import Vue from 'vue'
import PageBlockCard from './PageBlockCard'
import PageBlockPlain from './PageBlockPlain'

const wraps = {
  card: PageBlockCard,
  plain: PageBlockPlain,
}

const defaultWrap = 'card'

/**
 *
 * @param block {compose.PageBlock}
 * @returns {{computed: {blockClass(): [string, computed.block.kind]}, props: {block: {type: PageBlock, required: boolean}}}|{computed: {blockClass(): [string, *]}, props: {block: {type: PageBlock, required: boolean}}}}
 * @constructor
 */
function GetComponent ({ block }) {
  return wraps[block.style.wrap.kind || defaultWrap]
}

/**
 * Wraps page block with one of the configured (on page block options) components
 */
export default Vue.component('page-block', {
  functional: true,

  render (ce, ctx) {
    return ce(GetComponent(ctx.props), ctx.data, ctx.children)
  },
})

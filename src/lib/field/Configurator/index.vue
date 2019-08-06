<script>
import base from './base'
import * as Configurators from './loader'
import multi from './multi'

export default {
  components: {
    ...Configurators,
    multi,
  },

  extends: base,

  render (createElement) {
    const kind = this.field.kind.toLocaleLowerCase()
    const keys = Object.keys(this.$options.components)
    const i = keys.map(c => c.toLocaleLowerCase()).findIndex(c => c === kind)

    if (i >= 0) {
      return createElement('div', [
        createElement(this.$options.components[keys[i]], { props: this.$props }),
        createElement('multi', { props: this.$props }),
      ])
    } else {
      // It's ok if field does not have a configurator, no biggie
    }
  },
}
</script>

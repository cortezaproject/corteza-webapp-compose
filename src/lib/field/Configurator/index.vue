<script>
import base from './base'
import * as Configurators from './loader'

export default {
  extends: base,

  render (createElement) {
    const kind = this.field.kind.toLocaleLowerCase()
    const keys = Object.keys(this.$options.components)
    const i = keys.map(c => c.toLocaleLowerCase()).findIndex(c => c === kind)

    if (i >= 0) {
      return createElement(this.$options.components[keys[i]], {
        props: {
          field: this.field,
        },
      })
    } else {
      // It's ok if field does not have a configurator, no biggie
    }
  },

  components: {
    ...Configurators,
  },
}
</script>

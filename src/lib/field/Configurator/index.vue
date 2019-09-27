<script>
import base from './base'
import * as Configurators from './loader'
import multi from './multi'
import basic from './basic'

export default {
  components: {
    ...Configurators,
    multi,
    basic,
  },

  extends: base,

  render (createElement) {
    const kind = this.field.kind.toLocaleLowerCase()
    const keys = Object.keys(this.$options.components)
    const i = keys.map(c => c.toLocaleLowerCase()).findIndex(c => c === kind)
    const activeNavClass = 'bg-white'

    if (i >= 0) {
      return createElement('b-tabs', { attrs: { card: true, 'active-nav-item-class': activeNavClass } }, [
        createElement('b-tab', { attrs: { active: true, title: this.$t('general.label.general') } }, [
          createElement('basic', { props: this.$props }),
        ]),
        createElement('b-tab', { attrs: { title: this.field.kind } }, [
          createElement(this.$options.components[keys[i]], { props: this.$props }),
        ]),
        createElement('b-tab', { attrs: { title: this.$t('general.label.multi') } }, [
          createElement('multi', { props: this.$props }),
        ]),
      ])
    } else {
      // It's ok if field does not have a configurator, no biggie
    }
  },
}
</script>

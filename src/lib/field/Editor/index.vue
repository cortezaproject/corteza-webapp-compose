<script>
import * as Editors from './loader'
import { User as UserViewer, DateTime as DateTimeViewer } from '../Viewer/loader'
import base from './base'

export default {
  components: {
    ...Editors,
    UserViewer,
    DateTimeViewer,
  },

  extends: base,

  computed: {
    component () {
      let kind = this.field.kind.toLocaleLowerCase()

      if (this.field.isSystem) {
        switch (this.field.kind) {
          case 'User':
            return UserViewer
          case 'DateTime':
            return DateTimeViewer
        }
      }

      const keys = Object.keys(this.$options.components)
      const i = keys.map(c => c.toLocaleLowerCase()).findIndex(c => c === kind)

      if (i >= 0) {
        return Editors[keys[i]]
        // return this.$options.components[keys[i]]
      } else {
        return null
      }
    },
  },

  render (createElement) {
    const cmp = this.component

    if (cmp) {
      return createElement(cmp, {
        props: this.$props,
      })
    } else {
      return createElement('code', this.$t('notification.field.unknownFieldKind', { kind: this.field.kind }))
    }
  },
}
</script>

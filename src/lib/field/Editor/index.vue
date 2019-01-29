<script>
import * as Editors from './loader'
import { User as UserViewer, DateTime as DateTimeViewer } from '../Viewer/loader'
import base from './base'

export default {
  extends: base,

  render (createElement) {
    const cmp = this.component

    if (cmp) {
      return createElement(cmp, {
        props: {
          field: this.field,
          record: this.record,
        },
      })
    } else {
      return createElement('code', `Error: Unknown field kind "${this.field.kind}", no editor component found.`)
    }
  },

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

  components: {
    ...Editors,
    UserViewer,
    DateTimeViewer,
  },
}
</script>

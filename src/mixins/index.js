import alert from '@/mixins/alert'
import pretty from '@/mixins/pretty'

export default (Vue) => {
  Vue.mixin(alert)
  Vue.mixin(pretty)
}

import alert from 'corteza-webapp-compose/src/mixins/alert'
import pretty from 'corteza-webapp-compose/src/mixins/pretty'

export default (Vue) => {
  Vue.mixin(alert)
  Vue.mixin(pretty)
}

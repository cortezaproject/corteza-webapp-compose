// eslint-disable-next-line
import { default as component } from './FieldPicker.vue'

// "TypeError: this.module.systemFields is not a function"
const props = {
  disableSystemFields: false,
  module: {
    systemFields: '',
  },
  fields: [],
  disabledTypes: [],
  systemFields: [],
  fieldSubset: null,
  group: 'fields',
}

export default {
  name: 'Field picker',
  group: ['Common', 'Module'],
  component,
  props,
  controls: [],
}

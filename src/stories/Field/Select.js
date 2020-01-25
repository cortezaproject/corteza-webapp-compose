import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/Select'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/Select'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, button, object } from '@storybook/addon-knobs'

const field = new Field({
  name: 'Rating',
  label: 'Rating',
  kind: 'Select',
  isMulti: true,
  options: {
    options: [
      '☆☆☆☆☆',
      '★☆☆☆☆',
      '★★☆☆☆',
      '★★★☆☆',
      '★★★★☆',
      '★★★★★',
    ],
    selectType: 'default',
    multiDelimiter: '\n',
  },
})

const props = {
  field,

  namespace: {},

  record: {
    values: {
      Rating: ['★★★☆☆', '☆☆☆☆☆'],
    },
  },
}

const select = storiesOf('Field/Select', module)

const multiHandler = () => {
  field.isMulti = !field.isMulti
  if (field.isMulti) {
    props.record.values = {
      Rating: ['★★★☆☆', '☆☆☆☆☆'],
    }
  } else {
    props.record.values = { Rating: '★★★☆☆' }
  }
  return props
}

const selectTypeHandler = () => {
  const selectOptions = ['default', 'multiple', 'each']
  props.field.options.selectType = selectOptions[(selectOptions.indexOf(field.options.selectType) + 1) % selectOptions.length]
  return props
}

select.addDecorator(withKnobs)

select.add('Viewer', () => ({
  components: { Viewer },

  data () {
    return props
  },

  props: {
    isMulti: {
      default: button('Toggle multiple values', multiHandler),
    },

    fieldObject: {
      default: object('Field', props.field),
    },

    recordObject: {
      default: object('Record', props.record),
    },
  },

  template: '<viewer :field="field" :namespace="namespace" :record="recordObject" />',
  i18n: i18n(),
}))

select.add('Editor', () => ({
  components: { Editor },

  data () {
    return props
  },

  props: {
    isMulti: {
      default: button('Toggle multiple values', multiHandler),
    },

    selectType: {
      default: button('Cycle select type', selectTypeHandler),
    },

    fieldObject: {
      default: object('Field', props.field),
    },

    recordObject: {
      default: object('Record', props.record),
    },
  },

  template: '<editor :field="field" :namespace="namespace" :record="recordObject" />',
  i18n: i18n(),
}))

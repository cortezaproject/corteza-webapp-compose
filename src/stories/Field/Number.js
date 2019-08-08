import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/Number'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/Number'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, button, object } from '@storybook/addon-knobs'

let field = new Field({
  name: 'CaseNumber',
  label: 'Case Number',
  kind: 'Number',
  isMulti: true,
  options: {
    format: '0000000',
    prefix: '',
    suffix: '',
    precision: 0,
    multiDelimiter: '\n',
  },
})

let props = {
  field,

  namespace: {},

  record: {
    values: {
      CaseNumber: '1',
    },
  },
}

const number = storiesOf('Field/Number', module)

const multiHandler = () => {
  props.field.isMulti = !props.field.isMulti
  if (props.field.isMulti) {
    props.record.values = {
      CaseNumber: ['1', '2', '3'],
    }
  } else {
    props.record.values = { CaseNumber: '1' }
  }
  return props
}

number.addDecorator(withKnobs)

number.add('Viewer', () => ({
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

  template: '<viewer :field="field" :namespace="namespace" :record="record" />',
  i18n: i18n(),
}))

number.add('Editor', () => ({
  components: { Editor },

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

  template: '<editor :field="field" :namespace="namespace" :record="record" />',
  i18n: i18n(),
}))

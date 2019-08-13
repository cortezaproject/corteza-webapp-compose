import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/Url'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/Url'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, button, object } from '@storybook/addon-knobs'

let field = new Field({
  name: 'Url',
  label: 'Url',
  isMulti: true,
  kind: 'Url',
  options: {
    onlySecure: false,
    outputPlain: false,
    trimFragment: false,
    trimPath: false,
    trimQuery: false,
    multiDelimiter: '\n',
  },
})

let props = {
  field,

  namespace: {},

  record: {
    values: {
      Url: ['https://cortezaproject.org/'],
    },
  },
}

const url = storiesOf('Field/Url', module)

const multiHandler = () => {
  props.field.isMulti = !props.field.isMulti
  if (props.field.isMulti) {
    props.record.values = {
      Url: ['https://cortezaproject.org/', 'https://cortezaproject.org/'],
    }
  } else {
    props.record.values = { Url: 'https://cortezaproject.org/' }
  }
  return props
}

const plainHandler = () => {
  props.field.options.outputPlain = !props.field.options.outputPlain
  return props
}

url.addDecorator(withKnobs)

url.add('Viewer', () => ({
  components: { Viewer },

  data () {
    return props
  },

  props: {
    isMulti: {
      default: button('Toggle multiple values', multiHandler),
    },

    isPlain: {
      default: button('Toggle plain output', plainHandler),
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

url.add('Editor', () => ({
  components: { Editor },

  data () {
    return props
  },

  props: {
    isMulti: {
      default: button('Toggle multiple values', multiHandler),
    },

    isPlain: {
      default: button('Toggle plain output', plainHandler),
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

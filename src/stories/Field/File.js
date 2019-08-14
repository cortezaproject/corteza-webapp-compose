import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/File'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/File'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, button, object } from '@storybook/addon-knobs'

let field = new Field({
  name: 'File',
  label: 'File',
  isMulti: true,
  kind: 'File',
  options: {
    allowDocuments: false,
    allowImages: false,
    maxSize: undefined,
    mode: 'grid',
    multiDelimiter: '\n',
  },
})

let props = {
  field,

  namespace: {},

  record: {
    values: {
      File: ['1', '2'],
    },
  },
}

const file = storiesOf('Field/File', module)

const multiHandler = () => {
  props.field.isMulti = !props.field.isMulti
  if (props.field.isMulti) {
    props.record.values = {
      File: ['1', '2'],
    }
  } else {
    props.record.values = { File: '104123496589688841' }
  }
  return props
}

const modeHandler = () => {
  const modes = ['grid', 'list', 'single', 'gallery']
  props.field.options.mode = modes[(modes.indexOf(field.options.mode) + 1) % modes.length]
  return props
}

file.addDecorator(withKnobs)

file.add('Viewer', () => ({
  components: { Viewer },

  data () {
    return props
  },

  props: {
    isMulti: {
      default: button('Toggle multiple values', multiHandler),
    },

    mode: {
      default: button('Cycle mode', modeHandler),
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

file.add('Editor', () => ({
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

  template: '<editor :field="field" :namespace="namespace" :record="recordObject" />',
  i18n: i18n(),
}))

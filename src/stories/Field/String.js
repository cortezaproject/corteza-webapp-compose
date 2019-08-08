import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/String'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/String'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, button, object } from '@storybook/addon-knobs'

let field = new Field({
  name: 'Title',
  label: 'Title',
  isMulti: true,
  kind: 'String',
  options: {
    multiLine: false,
    useRichTextEditor: false,
    multiDelimiter: '\n',
  },
})

let props = {
  field,

  namespace: {},

  record: {
    values: {
      Title: ['1', '2', '3'],
    },
  },
}

const string = storiesOf('Field/String', module)

const multiHandler = () => {
  props.field.isMulti = !props.field.isMulti
  if (props.field.isMulti) {
    props.record.values = {
      Title: ['1', '2', '3'],
    }
  } else {
    props.record.values = { Title: '1' }
  }
  return props
}

const richHandler = () => {
  props.field.options.useRichTextEditor = !props.field.options.useRichTextEditor
  return props
}

const multilineHandler = () => {
  props.field.options.multiLine = !props.field.options.multiLine
  return props
}

string.addDecorator(withKnobs)

string.add('Viewer', () => ({
  components: { Viewer },

  data () {
    return props
  },

  props: {
    isMulti: {
      default: button('Toggle multiple values', multiHandler),
    },

    isRitch: {
      default: button('Toggle rich text editor', richHandler),
    },

    isMultiline: {
      default: button('Toggle multiline text editor', multilineHandler),
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

string.add('Editor', () => ({
  components: { Editor },

  data () {
    return props
  },

  props: {
    isMulti: {
      default: button('Toggle multiple values', multiHandler),
    },

    isRitch: {
      default: button('Toggle rich text editor', richHandler),
    },

    isMultiline: {
      default: button('Toggle multiline text editor', multilineHandler),
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

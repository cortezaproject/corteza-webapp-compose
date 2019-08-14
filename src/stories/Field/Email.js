import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/Email'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/Email'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, button, object } from '@storybook/addon-knobs'

let field = new Field({
  name: 'Email',
  label: 'Email',
  isMulti: true,
  kind: 'Email',
  options: {
    outputPlain: false,
    multiDelimiter: '\n',
  },
})

let props = {
  field,

  namespace: {},

  record: {
    values: {
      Email: ['test@mail.com', 'test2@mail.com'],
    },
  },
}

const email = storiesOf('Field/Email', module)

const multiHandler = () => {
  props.field.isMulti = !props.field.isMulti
  if (props.field.isMulti) {
    props.record.values = {
      Email: ['test@mail.com', 'test2@mail.com'],
    }
  } else {
    props.record.values = { Email: 'test@mail.com' }
  }
  return props
}

const plainHandler = () => {
  props.field.options.outputPlain = !props.field.options.outputPlain
  return props
}

email.addDecorator(withKnobs)

email.add('Viewer', () => ({
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

email.add('Editor', () => ({
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

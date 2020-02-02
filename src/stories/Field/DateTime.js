import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/DateTime'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/DateTime'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, button, object } from '@storybook/addon-knobs'

const field = new Field({
  name: 'Date',
  label: 'Date',
  isMulti: true,
  kind: 'DateTime',
  options: {
    format: '',
    onlyDate: false,
    onlyTime: false,
    onlyPastValues: false,
    onlyFutureValues: false,
    outputRelative: false,
    multiDelimiter: '\n',
  },
})

const props = {
  field,

  namespace: {},

  record: {
    values: {
      Date: ['2019-08-10 01:01', '2019-10-10 01:01'],
    },
  },
}

const dateTime = storiesOf('Field/DateTime', module)

const multiHandler = () => {
  props.field.isMulti = !props.field.isMulti
  if (props.field.isMulti) {
    props.record.values = {
      Date: ['2019-08-10 01:01', '2019-10-10 01:01'],
    }
  } else {
    props.record.values = { Date: '2019-08-10 01:01' }
  }
  return props
}

const timeOnlyHandler = () => {
  props.field.options.onlyTime = !props.field.options.onlyTime
  return props
}

const dateOnlyHandler = () => {
  props.field.options.onlyDate = !props.field.options.onlyDate
  return props
}

dateTime.addDecorator(withKnobs)

dateTime.add('Viewer', () => ({
  components: { Viewer },

  data () {
    return props
  },

  props: {
    isMulti: {
      default: button('Toggle multiple values', multiHandler),
    },

    isTimeOnly: {
      default: button('Toggle only time', timeOnlyHandler),
    },

    isDateOnly: {
      default: button('Toggle only date', dateOnlyHandler),
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

dateTime.add('Editor', () => ({
  components: { Editor },

  data () {
    return props
  },

  props: {
    isMulti: {
      default: button('Toggle multiple values', multiHandler),
    },

    isTimeOnly: {
      default: button('Toggle only time', timeOnlyHandler),
    },

    isDateOnly: {
      default: button('Toggle only date', dateOnlyHandler),
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

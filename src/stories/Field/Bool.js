import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/Bool'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/Bool'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, object } from '@storybook/addon-knobs'

const field = new Field({
  name: 'Closed',
  label: 'IsClosed',
  kind: 'Bool',
  options: {
    trueLabel: 'Yes',
    falseLabel: 'No',
    multiDelimiter: '\n',
  },
})

const props = {
  field,

  namespace: {},

  record: {
    values: {
      IsClosed: undefined,
    },
  },
}

const bool = storiesOf('Field/Bool', module)

bool.addDecorator(withKnobs)

bool.add('Viewer', () => ({
  components: { Viewer },

  data () {
    return props
  },

  props: {
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

bool.add('Editor', () => ({
  components: { Editor },

  data () {
    return props
  },

  props: {
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

import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/Record'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/Record'
import i18n from 'corteza-webapp-compose/src/i18n'
import Vuex from 'vuex'
import { withKnobs, button, object } from '@storybook/addon-knobs'

import ComposeAPI from '../compose'

import module from 'corteza-webapp-compose/src/store/module'
import page from 'corteza-webapp-compose/src/store/page'

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    module: module(ComposeAPI),
    page: page(ComposeAPI),
  },
})

store.dispatch('module/load')

let field = new Field({
  fieldID: '1',
  name: 'LeadId',
  label: 'Lead',
  isMulti: true,
  kind: 'Record',
  options: {
    moduleID: '1',
    labelField: 'RecordLabel',
    queryFields: [
      'RecordLabel',
    ],
    selectType: 'default',
    multiDelimiter: '\n',
  },
})

let props = {
  field,

  namespace: {},

  record: {
    moduleID: '1',
    recordID: '1',
    values: {
      LeadId: ['1', '2'],
    },
  },
}

const record = storiesOf('Field/Record', module)

const multiHandler = () => {
  props.field.isMulti = !props.field.isMulti
  if (props.field.isMulti) {
    props.record.values = {
      LeadId: ['1', '2'],
    }
  } else {
    props.record.values = { LeadId: '1' }
  }
  return props
}

const selectTypeHandler = () => {
  const selectOptions = ['default', 'multiple', 'each']
  props.field.options.selectType = selectOptions[(selectOptions.indexOf(field.options.selectType) + 1) % selectOptions.length]
  return props
}

record.addDecorator(withKnobs)

record.add('Viewer', () => ({
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
  store: store,
}))

record.add('Editor', () => ({
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
  store: store,
}))

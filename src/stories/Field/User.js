import { storiesOf } from '@storybook/vue'
import Field from 'corteza-webapp-compose/src/lib/field'
import Viewer from 'corteza-webapp-compose/src/lib/field/Viewer/User'
import Editor from 'corteza-webapp-compose/src/lib/field/Editor/User'
import i18n from 'corteza-webapp-compose/src/i18n'
import Vuex from 'vuex'
import { withKnobs, button, object } from '@storybook/addon-knobs'

import SystemAPI from '../system'
import user from 'corteza-webapp-compose/src/store/user'

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    user: user(SystemAPI),
  },
})

store.dispatch('user/load')

let field = new Field({
  name: 'OwnerId',
  label: 'Account Owner',
  isMulti: true,
  kind: 'User',
  options: {
    multiDelimiter: '\n',
    presetWithAuthenticated: false,
    selectType: 'default',
  },
})

let props = {
  field,

  namespace: {},

  record: {
    values: {
      OwnerId: ['1', '2'],
    },
  },
}

const userStory = storiesOf('Field/User', module)

const multiHandler = () => {
  props.field.isMulti = !props.field.isMulti
  if (props.field.isMulti) {
    props.record.values = {
      OwnerId: ['1', '2'],
    }
  } else {
    props.record.values = { OwnerId: '1' }
  }
  return props
}

const selectTypeHandler = () => {
  const selectOptions = ['default', 'multiple', 'each']
  props.field.options.selectType = selectOptions[(selectOptions.indexOf(field.options.selectType) + 1) % selectOptions.length]
  return props
}

userStory.addDecorator(withKnobs)

userStory.add('Viewer', () => ({
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
      default: object('User', props.record),
    },
  },

  template: '<viewer :field="field" :namespace="namespace" :record="recordObject" />',
  i18n: i18n(),
  store: store,
}))

userStory.add('Editor', () => ({
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
      default: object('User', props.record),
    },
  },

  template: '<editor :field="field" :namespace="namespace" :record="recordObject" />',
  i18n: i18n(),
  store: store,
}))

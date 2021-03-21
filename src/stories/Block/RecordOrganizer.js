import { storiesOf } from '@storybook/vue'
import Viewer from 'corteza-webapp-compose/src/lib/block/View/'
import i18n from 'corteza-webapp-compose/src/i18n'
import store from '../store'
import toast from 'corteza-webapp-compose/src/mixins/toast'
import users from 'corteza-webapp-compose/src/mixins/users'
import { withKnobs, object } from '@storybook/addon-knobs'

const block1 = {
  title: 'Record organizer title',
  description: '',
  kind: 'RecordOrganizer',
  options: {
    moduleID: '1',
    labelField: 'RecordLabel',
    descriptionField: 'Name',
    prefilter: 'Name',
    settingField: 'Name',
    settingValue: 'Test name Test',
  },
  style: {
    variants: {
      headerBg: 'white',
      headerText: 'primary',
      bodyBg: 'white',
      border: 'primary',
    },
  },
}

const block2 = {
  title: 'Record organizer title 2',
  description: '',
  kind: 'RecordOrganizer',
  options: {
    moduleID: '1',
    labelField: 'RecordLabel',
    descriptionField: 'Name',
    prefilter: 'Name IS NULL',
    settingField: 'Name',
    settingValue: '',
  },
  style: {
    variants: {
      headerBg: 'white',
      headerText: 'primary',
      bodyBg: 'white',
      border: 'primary',
    },
  },
}

const namespace = {
  namespaceID: '1',
}

const recordOrganizer = storiesOf('Block/RecordOrganizer', module)

store.dispatch('module/load', namespace)

recordOrganizer.addDecorator(withKnobs)

recordOrganizer.add('RecordOrganizer', () => ({
  components: { Viewer },

  store,

  mixins: [
    toast,
    users,
  ],

  data () {
    return {
      namespace: namespace,
      page: {},
    }
  },

  props: {
    block1: {
      default: object('Block 1', block1),
    },
    block2: {
      default: object('Block 2', block2),
    },
  },

  template: `
            <div class="row h-100">
              <viewer :block="block1" :namespace="namespace" :page="page" class="m-3 w-25" />
              <viewer :block="block2" :namespace="namespace" :page="page" class="m-3 w-25" />
            </div>`,
  i18n: i18n(),
}))

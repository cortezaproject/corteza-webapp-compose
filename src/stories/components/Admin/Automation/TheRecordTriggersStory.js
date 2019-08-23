import '@/stories/setup'
import { storiesOf } from '@storybook/vue'
import i18nInit from '@/i18n'
import { withKnobs } from '@storybook/addon-knobs'
import RecordEventsTable from '@components/Admin/Automation/TheRecordTriggers'
import Module from 'corteza-webapp-compose/src/lib/module'
import AutomationTrigger from 'corteza-webapp-common/src/lib/types/shared/automation-trigger'

const story = storiesOf('Admin|Automation', module)
  .addDecorator(withKnobs)
  .addDecorator(() => {
    return {
      template: `<div class="p-5"><b-card><story /></b-card></div>`,
    }
  })

const maxModules = 9
const maxTriggers = maxModules * 1
const events = [
  'beforeCreate',
  'afterCreate',
  'beforeUpdate',
  'afterUpdate',
  'beforeDelete',
  'afterDelete',
]

const modules = { default: Array.apply(0, Array(maxModules)).map((a, index) => {
  let ID = index + 1
  return new Module({
    moduleID: ID.toString(),
    name: `Module #${ID}`,
  })
}) }

const randEvent = () => events[Math.round(Math.random() * events.length)]

const triggers = { default: Array.apply(0, Array(maxTriggers)).map((a, index) => {
  let moduleID = index + 1
  return new AutomationTrigger({
    condition: (Math.round(Math.random() * maxModules) + moduleID).toString(),
    event: randEvent(),
    resource: 'compose:record',
    enabled: true,
  })
}) }

story.add('Record events trigger table', () => ({
  components: { RecordEventsTable },
  i18n: i18nInit(),
  props: {
    modules,
    triggers,
  },

  template: `<record-events-table :modules="modules" :triggers.sync="triggers" />`,
}))

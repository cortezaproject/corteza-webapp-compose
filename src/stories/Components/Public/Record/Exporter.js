import { storiesOf } from '@storybook/vue'
import Module from 'corteza-webapp-compose/src/lib/module'
import Exporter from 'corteza-webapp-compose/src/components/Public/Record/Exporter'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, object, select, text, number, boolean } from '@storybook/addon-knobs'

let fields = [
  {
    kind: 'String',
    label: 'First Name',
    name: 'FirstName',
  },
  {
    kind: 'String',
    label: 'Last Name',
    name: 'LastName',
  },
  {
    kind: 'Email',
    label: 'Email',
    name: 'Email',
  },
  {
    kind: 'File',
    label: 'File',
    name: 'File',
  },
]

let props = {
  module: new Module({
    fields: fields,
  }),

  preselectedFields: [
    {
      kind: 'String',
      label: 'First Name',
      name: 'FirstName',
    },
  ],
  allowJSON: true,
  allowCSV: true,
  recordCount: 43,

  filterRangeType: 'all',
  filterRangeBy: 'created_at',

  dateRange: 'lastMonth',
  startDate: '',
  endDate: '',
}

const selectionTypeOptions = {
  All: 'all',
  Range: 'range',
}

const rangeTypeOptions = {
  Created: 'created_at',
  Updated: 'updated_at',
}

const dateRangeOptions = {
  LastMonth: 'lastMonth',
  ThisMonth: 'thisMonth',
  LastWeek: 'lastWeek',
  ThisWeek: 'thisWeek',
  Today: 'today',
  Custom: 'custom',
}

const exporter = storiesOf('Components/Public/Record/Exporter', module)

function Modal () {
  return {
    template: `
      <div>
        <b-button v-b-modal.exportModal>Open export modal</b-button>
        <b-modal :visible="true" size="lg" id="exportModal" title="Export" hide-footer body-class="p-0">
          <story/>
        </b-modal>
      </div>
    `,
  }
}

exporter.addDecorator(Modal)

exporter.addDecorator(withKnobs)

exporter.add('Exporter', () => ({
  components: { Exporter },

  data () {
    return {
      module: props.module,
    }
  },

  props: {
    allowJSON: {
      default: boolean('Allow JSON export', props.allowJSON),
    },
    allowCSV: {
      default: boolean('Allow CSV export', props.allowCSV),
    },
    recordCount: {
      default: number('Record count', props.recordCount),
    },
    filterRangeType: {
      default: select('Selection type', selectionTypeOptions, props.filterRangeType),
    },
    filterRangeBy: {
      default: select('Filter range by', rangeTypeOptions, props.filterRangeBy),
    },
    dateRange: {
      default: select('Date range', dateRangeOptions, props.dateRange),
    },
    startDate: {
      default: text('Start date ("YYYY-MM-DD")', props.startDate),
    },
    endDate: {
      default: text('End date ("YYYY-MM-DD")', props.endDate),
    },
    preselectedFields: {
      default: object('Preselected fields', props.preselectedFields),
    },
  },

  template: `<exporter 
              :module="module"
              :preselectedFields="preselectedFields"
              :allowJSON="allowJSON"
              :allowCSV="allowCSV"
              :recordCount="recordCount"
              :filterRangeType="filterRangeType"
              :filterRangeBy="filterRangeBy"
              :dateRange="dateRange"
              :startDate="startDate"
              :endDate="endDate" />`,
  i18n: i18n(),
}))

import { storiesOf } from '@storybook/vue'
import Module from 'corteza-webapp-compose/src/lib/module'
import Exporter from 'corteza-webapp-compose/src/components/Public/Record/Exporter'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, object, select, text } from '@storybook/addon-knobs'

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

  selectionType: 'all',
  filterRangeBy: 'createdAt',

  dateRange: 'lastMonth',
}

const selectionTypeOptions = {
  All: 'all',
  Range: 'range',
}

const rangeTypeOptions = {
  Created: 'createdAt',
  Updated: 'updatedAt',
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

exporter.addDecorator(withKnobs)

exporter.add('Exporter', () => ({
  components: { Exporter },

  data () {
    return {
      module: props.module,
    }
  },

  props: {
    preselectedFields: {
      default: object('Preselected fields', props.preselectedFields),
    },
    selectionType: {
      default: select('Selection type', selectionTypeOptions, props.selectionType),
    },
    filterRangeBy: {
      default: select('Filter range by', rangeTypeOptions, props.filterRangeBy),
    },
    dateRange: {
      default: select('Date range', dateRangeOptions, props.dateRange),
    },
    startDate: {
      default: text('Start date("YYYY-MM-DD")', ''),
    },
    endDate: {
      default: text('End date("YYYY-MM-DD")', ''),
    },
  },

  template: `<exporter 
              :module="module"
              :preselectedFields.sync="preselectedFields"
              :selectionType.sync="selectionType"
              :filterRangeBy.sync="filterRangeBy"
              :dateRange.sync="dateRange"
              :startDate.sync="startDate"
              :endDate.sync="endDate" />`,
  i18n: i18n(),
}))

// eslint-disable-next-line
import { default as component } from './ReportEdit.vue'

const props = {
  report: {
    moduleID: '291598304537084005',
    filter: '',
    colorScheme: '#fffff',
    metrics: [
      {
        aggregate: 'AVG',
        field: 'count',
        moduleID: '291598304537084005',
      },
    ],
    dimensions: [{
      field: 'Rating',
      modifier: '(no grouping / buckets)',
      skipMissing: true,
    }],
  },
  modules: [
    {
      moduleID: '291598304537084005',
      handle: 'Case',
      name: 'Case',
      fields: [{
        kind: 'Record',
        name: 'AccountId',
        options: {
          multiLine: false,
          useRichTextEditor: false,
        },
      }],
    },
  ],
  supportedMetrics: -1,
  dimensionFieldKind: ['DateTime', 'Select', 'Number', 'Bool', 'String'],
  unSkippable: false,
}

export default {
  name: 'Edit',
  group: ['Chart', 'Report'],
  component,
  props,
  controls: [],

  scenarios: [
    {
      label: 'Full form',
      props,
    },
    {
      label: 'Empty form',
      props: {
        ...props,
        modules: [],
      },
    },
  ],
}

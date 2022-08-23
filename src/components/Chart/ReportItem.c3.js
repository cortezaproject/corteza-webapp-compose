// eslint-disable-next-line
import { default as component } from './ReportItem.vue'
import { components } from '@cortezaproject/corteza-vue'
const { checkbox } = components.C3.controls

const props = {
  report: {},
  fixed: true,
}

export default {
  wip: true,
  name: 'Report item',
  group: ['Chart'],
  component,
  props,
  controls: [
    checkbox('Fixate report', 'fixed'),
  ],
  scenarios: [
    {
      label: 'Full form',
      props,
    },
    {
      label: 'Empty form',
      props: {
        ...props,
        fixed: false,
      },
    },
  ],
}

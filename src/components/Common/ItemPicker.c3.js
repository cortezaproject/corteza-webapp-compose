// eslint-disable-next-line
import { default as component } from './ItemPicker.vue'
// import { components } from '@cortezaproject/corteza-vue'
// const { checkbox, input } = components.C3.controls

const props = {
  // slots
  keyProp: 'value',
  items: [
    {
      text: 'Customer Referral',
      value: 'Customer Referral',
      color: undefined,
    },
    {
      text: 'Direct',
      value: 'Direct',
      color: undefined,
    },
    {
      text: 'Employee Referral',
      value: 'Employee Referral',
      color: undefined,
    },
  ],
  selected: [
    // {
    //   color: undefined,
    //   text: 'Customer Referral',
    //   value: 'Customer Referral',
    // },
  ],
}

export default {
  name: 'Item picker WIP',
  group: ['Common'],
  component,
  props,
  controls: [],
}

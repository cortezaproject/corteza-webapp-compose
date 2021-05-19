export default {
  name: 'RecordView',
  steps: [
    {
      target: '[data-v-onboarding="edit"]',
      header: {
        title: 'Edit record',
      },
      content: 'Click on "Edit" button to edit the record. ',
    },
    {
      target: '[data-v-onboarding="back"]',
      header: {
        title: 'Go back',
      },
      content: 'Click on "Back" button to exit without saving the changes. ',
    },
  ],
}

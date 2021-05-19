export default {
  name: 'ChartEdit',
  steps: [
    {
      target: '[data-v-onboarding="chart-edit"]',
      header: {
        title: 'Chart builder',
      },
      content:
        'Create chart for the visual presentation of your data',
    },
    {
      target: '[data-v-onboarding="chart-name"]',
      header: {
        title: 'Change the name',
      },
      content:
        'Enter / change the name to identificate your chart.',
    },
    {
      target: '[data-v-onboarding="module"]',
      header: {
        title: 'Assign module',
      },
      content: 'Assign module to connect it with chart.',
      params: {
        placement: 'top',
      },
    },
    {
      target: '[data-v-onboarding="axis"]',
      header: {
        title: 'Chart parameters',
      },
      content: 'Define chart parameters to get the display which corresponds best to your data',
    },
    {
      target: '[data-v-onboarding="save-and-close"]',
      header: {
        title: 'Save changes',
      },
      content: 'Click on "Save" button or "Save and close" button to save and return to the previous page. ',
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

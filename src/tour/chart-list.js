export default {
  name: 'ChartList',
  steps: [
    {
      target: '[data-v-onboarding="chart-list"]',
      header: {
        title: 'List of charts',
      },
      content: 'Collection of your charts, you can edit individual chart by selecting it in the table ',
    },
    {
      target: '[data-v-onboarding="new-chart"]',
      header: {
        title: 'New chart',
      },
      content: 'To create a new chart click on the "New chart" button.',
    },
    {
      target: '[data-v-onboarding="import-export"]',
      header: {
        title: 'Import / export charts',
      },
      content: 'You can import previously saved charts or export them to your desired location.',
    },
    {
      target: '[data-v-onboarding="permissions"]',
      header: {
        title: 'Change the permission',
      },
      content: 'Change who can whave access to read, change or delete charts. ',
    },
    {
      target: '[data-v-onboarding="search"]',
      header: {
        title: 'Search',
      },
      content: 'Find the desired chart by typing its name in the search box.',
    },
  ],
}

export default {
  name: 'ModuleList',
  steps: [
    {
      target: '[data-v-onboarding="module-list"]',
      header: {
        title: 'Modules',
      },
      content: 'Modules allow you to easily and quickly create data with no coding required.',
    },
    {
      target: '[data-v-onboarding="new-module"]',
      header: {
        title: 'New module',
      },
      content: 'To create a new module click on the "New module" button.',
    },
    {
      target: '[data-v-onboarding="import-export"]',
      header: {
        title: 'Import / export modules',
      },
      content: 'You can import previously saved modules or export them to your desired location.',
    },
    {
      target: '[data-v-onboarding="permissions"]',
      header: {
        title: 'Change the permission',
      },
      content: 'Change who can whave access to read, change or delete modules. ',
    },
    {
      target: '[data-v-onboarding="search"]',
      header: {
        title: 'Search',
      },
      content: 'Find the desired module by typing its name in the search box.',
    },
    {
      target: '[data-v-onboarding="builder"]',
      header: {
        title: 'Page Builder',
      },
      content: 'You can change how elements are displayed on a page in the page builder.',
    },
  ],
}

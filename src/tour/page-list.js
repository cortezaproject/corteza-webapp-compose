export default {
  name: 'PageList',
  steps: [
    {
      target: '[data-v-onboarding="page-list"]',
      header: {
        title: 'Pages',
      },
      content: 'Pages allow you to organize the layout of your content.',
    },
    {
      target: '[data-v-onboarding="create-page"]',
      header: {
        title: 'Create page',
      },
      content: 'To create a new page enter the page "Title" and click on the "Create page" button.',
    },
    {
      target: '[data-v-onboarding="permissions"]',
      header: {
        title: 'Change the permission',
      },
      content: 'Change who can whave access to read, change or delete pages. ',
    },
  ],
}

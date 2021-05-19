export default {
  name: 'PageEdit',
  steps: [
    {
      target: '[data-v-onboarding="page-edit"]',
      header: {
        title: 'Edit page',
      },
      content: 'You can edit / create a page, change it\'s name, description and visibility. ',
    },
    {
      target: '[data-v-onboarding="builder"]',
      header: {
        title: 'Page builder',
      },
      content: 'Use page builder to organize the page layout.',
      params: {
        placement: 'top',
      },
    },
    {
      target: '[data-v-onboarding="page-visibility"]',
      header: {
        title: 'Change the visibility',
      },
      content: 'Change visibility of the page by sritching the toggle on or off ',
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

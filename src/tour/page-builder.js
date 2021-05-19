export default {
  name: 'PageBuilder',
  steps: [
    {
      target: '[data-v-onboarding="page-builder"]',
      header: {
        title: 'Page builder',
      },
      content: 'You can edit / change which elemnents will be diplayed on the page, start by adding a new block to your page. ',
      params: {
        placement: 'auto',
      },
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

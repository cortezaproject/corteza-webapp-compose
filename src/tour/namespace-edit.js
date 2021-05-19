export default {
  name: 'NamespaceEdit',
  steps: [
    {
      target: '[data-v-onboarding="namespace-edit"]',
      header: {
        title: 'Create / edit namespace',
      },
      content: 'Following this guide you can easily create / change the namespace details.',
    },
    {
      target: '[data-v-onboarding="change-name"]',
      header: {
        title: 'Change the name',
      },
      content: 'Change the full or short namespace name, The short name will be used in the URL. ',
    },
    {
      target: '[data-v-onboarding="enable-on-list"]',
      header: {
        title: 'Enable on namespace list',
      },
      content: 'Enable or disable namespace on namespace/application list.',
      params: {
        placement: 'top',
      },
    },
    {
      target: '[data-v-onboarding="logo"]',
      header: {
        title: 'Logo',
      },
      content: 'Select a logo for your namespace, click on the preview button to see the assigned logo.',
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

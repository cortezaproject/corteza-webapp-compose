export default {
  name: 'NamespaceEdit',
  steps: [
    {
      target: '[data-v-onboarding="namespace-edit"]',
      header: {
        title: 'Edit namespace',
      },
      content: 'Following this guide you can easily change the namespace details',
    },
    {
      target: '[data-v-onboarding="change-name"]',
      header: {
        title: 'Change the name',
      },
      content: 'Change the full or short namespace name, The short name will be used in the URL ',
    },
    {
      target: '[data-v-onboarding="enable-on-list"]',
      header: {
        title: 'Enable on namespace list',
      },
      content: 'Enable or disable namespace on namespace/application list',
      params: {
        placement: 'top',
      },
    },
  ],
}

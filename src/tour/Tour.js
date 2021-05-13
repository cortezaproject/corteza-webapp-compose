export default {
  namespacesTour: {
    name: 'namespacesTour',
    steps: [
      {
        target: '[data-v-onboarding="welcome"]',
        header: {
          title: 'Welcome to Corteza app!',
        },
        content: 'Your tour to get farmilliar with the coerteza app has just started. You can turn the tour on or off at any moment by clicking on the tour button (todo)!',
      },
      {
        target: '[data-v-onboarding="permissions"]',
        header: {
          title: 'Permissions',
        },
        content: 'You can change permissions of the avaliable <strong>namespaces </strong> in the permissions dialog.',
      },
      {
        target: '[data-v-onboarding="search"]',
        header: {
          title: 'Search',
        },
        content: 'Find the desired namespace by typing its name in the search box.',
        params: {
          placement: 'top',
        },
      },
    ],
  },

  editNamespaceTour: {
    name: 'editNamespaceTour',
    steps: [
      {
        target: '[data-v-onboarding="edit-namespace"]',
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
  },
}

export default {
  namespacesTour: {
    name: 'namespacesTour',
    steps: [
      {
        target: '[data-v-step="0"]',
        header: {
          title: 'Welcome to Corteza app!',
        },
        content: 'Your tour to get farmilliar with the coerteza app has just started. You can turn the tour on or off at any moment by clicking on the tour button (todo)!',
      },
      {
        target: '[data-v-step="1"]',
        header: {
          title: 'Permissions',
        },
        content: 'You can change permissions of the avaliable <strong>namespaces </strong> in the permissions dialog.',
      },
      {
        target: '[data-v-step="2"]',
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
        target: '[data-v-step="0"]',
        header: {
          title: 'Edit namespace',
        },
        content: 'Following this guide you can easily change the namespace details',
      },
      {
        target: '[data-v-step="1"]',
        header: {
          title: 'Change the name',
        },
        content: 'Change the full or short namespace name, The short name will be used in the URL ',
      },
      {
        target: '[data-v-step="2"]',
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

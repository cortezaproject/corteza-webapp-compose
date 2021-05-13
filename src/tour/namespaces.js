export default {
  name: 'Namespaces',
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
}

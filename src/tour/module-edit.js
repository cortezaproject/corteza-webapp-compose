export default {
  name: 'ModuleEdit',
  steps: [
    {
      target: '[data-v-onboarding="module-edit"]',
      header: {
        title: 'Edit module',
      },
      content: 'Let\'s start creating / editing your first module!',
    },
    {
      target: '[data-v-onboarding="module-name"]',
      header: {
        title: 'Enter module name',
      },
      content: 'Enter the name you want to assign to your module.',
    },
    {
      target: '[data-v-onboarding="manage-records"]',
      header: {
        title: 'Manage record fields',
      },
      content: 'You can add different types of fields to your module, including: Checkboxes, Lists, File uploads',
      params: {
        placement: 'top',
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

import { configure } from '@storybook/vue';

const req = require.context('../src/stories/', true, /Story\.js$/)


function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module);

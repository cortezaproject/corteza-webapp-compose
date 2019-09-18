import { configure } from '@storybook/vue';
import 'corteza-webapp-compose/src/stories/setup';

const req = require.context('../src/stories', true, /\.stories\.js$/)

function loadStories() {
  require('../src/stories/Field/String')
  require('../src/stories/Field/Select')
  require('../src/stories/Field/Bool')
  require('../src/stories/Field/Number')
  require('../src/stories/Field/DateTime')
  require('../src/stories/Field/Email')
  require('../src/stories/Field/File')
  require('../src/stories/Field/Url')
  require('../src/stories/Field/Record')
  require('../src/stories/Field/User')
  require('../src/stories/Components/Public/Record/Exporter')
  require('../src/stories/Block/RecordOrganizer')
  require('../src/stories/corteza-webapp-common/components/Input')
  //req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)

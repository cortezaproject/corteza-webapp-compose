import component from './CTranslatorForm.vue'
// import { components } from '@cortezaproject/corteza-vue'
// const { checkbox } = components.C3.controls

const props = {
  // disabled: false,

  languages: [
    { localizedName: 'English', name: 'English', tag: 'en' },
    { localizedName: 'German', name: 'German', tag: 'de' },
    { localizedName: 'Italian', name: 'italiano', tag: 'it' },
  ],

  primaryResource: 'compose:page/291598304267993189/291598304588464229',

  translations: [
    { key: 'title', lang: 'en', message: 'Title', resource: 'compose:page/291598304267993189/291598304588464229' },
    { key: 'title', lang: 'de', message: 'Title', resource: 'compose:page/291598304267993189/291598304588464229' },
    { key: 'title', lang: 'it', message: 'Titolo', resource: 'compose:page/291598304267993189/291598304588464229' },

    { key: 'description', lang: 'en', message: 'Description', resource: 'compose:page/291598304267993189/291598304588464229' },
    { key: 'description', lang: 'de', message: 'Bezeichnung', resource: 'compose:page/291598304267993189/291598304588464229' },
    { key: 'description', lang: 'it', message: 'Descrizione', resource: 'compose:page/291598304267993189/291598304588464229' },

    { key: 'name', lang: 'en', message: 'Name', resource: 'compose:page/291598304267993189/291598304588464229' },
    { key: 'name', lang: 'de', message: 'Name', resource: 'compose:page/291598304267993189/291598304588464229' },
    { key: 'name', lang: 'it', message: 'Nome', resource: 'compose:page/291598304267993189/291598304588464229' },

    { key: 'contact', lang: 'en', message: 'Contact', resource: 'compose:page/291598304267993189/291598304588464229' },
    { key: 'contact', lang: 'de', message: 'Contakt', resource: 'compose:page/291598304267993189/291598304588464229' },
    { key: 'contact', lang: 'it', message: 'Contatto', resource: 'compose:page/291598304267993189/291598304588464229' },
  ],

  highlightKey: '',
}

export default {
  name: 'Form',
  group: ['Translator'],
  component,
  props,
  controls: [
    // checkbox('Disabled', 'disabled'),
  ],
}

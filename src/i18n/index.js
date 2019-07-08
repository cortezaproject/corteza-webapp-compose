// i18n / languages / translations

import i18next from 'i18next'
import lngDetector from 'i18next-browser-languagedetector'
import VueI18Next from '@panter/vue-i18next'
import moment from 'moment'

// All Calendar locales we need
// see https://github.com/fullcalendar/fullcalendar/tree/master/locales for full list
// @todo test if and how this even works!?
import 'fullcalendar/dist/locale/de.js'
import 'fullcalendar/dist/locale/es.js'
import 'fullcalendar/dist/locale/fr.js'
import 'fullcalendar/dist/locale/it.js'
import 'fullcalendar/dist/locale/es-us.js'
import 'fullcalendar/dist/locale/en-gb.js'

import en from './en'

// Initializes i18n options, registers
// plugin on a given Vue instance and returns the options (to be used in new Vue({ i18n: ... })
export default (Vue, lng = 'en', fallbackLng = lng) => {
  const options = {
    lng,
    fallbackLng,
    defaultNS: 'compose',
    ns: ['compose'],
    debug: process.env.NODE_ENV !== 'production',
    detection: {
      // to overwrite, to use user defined, to guess user's lang
      order: ['querystring', 'localStorage', 'cookie', 'navigator'],
      caches: [/* 'localStorage', 'cookie' */],
    },
    resources: {
      en,
    },
  }

  i18next.use(lngDetector).init(options)

  Vue.use(VueI18Next)

  // Set locales for other libs we use:
  moment.locale(lng)

  return new VueI18Next(i18next)
}

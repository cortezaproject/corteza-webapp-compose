import Vue from 'vue'

import i18next from 'i18next'
import VueI18Next from '@panter/vue-i18next'

// Plugins for i18next
import xhrBackend from 'i18next-xhr-backend'
import lngDetector from 'i18next-browser-languagedetector'

Vue.use(VueI18Next)

i18next
  .use(xhrBackend)
  .use(lngDetector)
  .init({
    fallbackLng: window.CrustConfig.webapp.defaultLocale || 'en',
    debug: process.env.NODE_ENV !== 'production',
    detection: {
      // to overwrite, to use user defined, to guess user's lang
      order: ['querystring', 'localStorage', 'cookie', 'navigator'],
      caches: [/* 'localStorage', 'cookie' */],
    },
    backend: {
      loadPath: `${process.env.BASE_URL}lang/{{lng}}.json`,
    },
  })

export default new VueI18Next(i18next)

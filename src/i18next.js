import Vue from 'vue'

import i18next from 'i18next'
import VueI18Next from '@panter/vue-i18next'

// Plugins for i18next
import cBackend from 'i18next-chained-backend'
import xhrBackend from 'i18next-xhr-backend'
// import localBackend from 'i18next-localstorage-backend'
import lngDetector from 'i18next-browser-languagedetector'

Vue.use(VueI18Next)

i18next
  .use(cBackend)
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
      backends: [
        // localBackend,
        xhrBackend,
      ],
      backendOptions: [
        // {
        //   // Use session storage so we won't cache them for too long.
        //   // Could use window.localStorage with a set expirationTime for eg. 1day or so
        //   store: window.sessionStorage,

        //   // Another option would be to use versions for languages, so we would only refetch
        //   // if the version has changed; here ttl has to be a lot longer.
        //   // https://github.com/i18next/i18next-localstorage-backend#cache-backend-options
        // },
        {
          loadPath: `/lang/{{lng}}.json`,
          crossDomain: false,
        },
      ],
    },
  })

export default new VueI18Next(i18next)
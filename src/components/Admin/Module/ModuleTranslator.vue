<template>
  <c-translator-button
    v-if="canManageResourceTranslations && resourceTranslationsEnabled"
    button-variant="light"
    class="btn-lg ml-auto mr-1"
    v-bind="$props"
    :resource="resource"
    :titles="titles"
    :fetcher="fetcher"
    :updater="updater"
  />
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'
import { mapGetters } from 'vuex'
import CTranslatorButton from 'corteza-webapp-compose/src/components/Translator/CTranslatorButton'

export default {
  components: {
    CTranslatorButton,
  },

  i18nOptions: {
    namespaces: 'resource-translator',
    keyPrefix: 'resources.module',
  },

  props: {
    module: {
      type: compose.Module,
      required: true,
    },

    highlightKey: {
      type: String,
      default: '',
    },

    disabled: {
      type: Boolean,
      default: () => false,
    },
  },

  computed: {
    ...mapGetters({
      can: 'rbac/can',
    }),

    canManageResourceTranslations () {
      return this.can('compose/', 'resource-translations.manage')
    },

    resource () {
      const { moduleID, namespaceID } = this.module
      return `compose:module/${namespaceID}/${moduleID}`
    },

    titles () {
      const { handle, moduleID, namespaceID, fields } = this.module
      const titles = {}

      titles[this.resource] = this.$t('title', { handle })

      fields.forEach(({ fieldID, name }) => {
        titles[`compose:module-field/${namespaceID}/${moduleID}/${fieldID}`] = this.$t('field.title', { name })
      })

      return titles
    },

    fetcher () {
      const { moduleID, namespaceID } = this.module

      return () => {
        return this.$ComposeAPI.moduleListTranslations({ namespaceID, moduleID })
      }
    },

    updater () {
      const { moduleID, namespaceID } = this.module

      return translations => {
        return this.$ComposeAPI
          .moduleUpdateTranslations({ namespaceID, moduleID, translations })
          .then(() => {
            const lang = this.resourceTranslationLanguages[0]

            // When translations are successfully saved,
            // scan changes and apply them back to the passed object
            // not the most elegant solution but is saves us from
            // handling the resource on multiple places
            const find = (key) => {
              return translations.find(t => t.key === key && t.lang === lang && t.resource === this.resource)
            }

            const tr = find('name')
            if (tr !== undefined) {
              this.module.name = tr.message
            }
          })
      }
    },
  },
}
</script>

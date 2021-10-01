<template>
  <c-translator-button
    v-if="canManageResourceTranslations && resourceTranslationsEnabled"
    button-variant="light"
    class="btn ml-auto mr-1"
    v-bind="$props"
    :disabled="disabled"
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
    keyPrefix: 'resources.namespace',
  },

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    disabled: {
      type: Boolean,
      default: () => false,
    },

    highlightKey: {
      type: String,
      default: '',
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
      const { namespaceID } = this.namespace
      return `compose:namespace/${namespaceID}`
    },

    titles () {
      const { namespaceID, slug: handle } = this.namespace
      const titles = {}

      titles[this.resource] = this.$t('title', { handle: handle || namespaceID })

      return titles
    },

    fetcher () {
      const { namespaceID } = this.namespace

      return () => {
        return this.$ComposeAPI.namespaceListTranslations({ namespaceID })
      }
    },

    updater () {
      const { namespaceID } = this.namespace
      return translations => {
        return this.$ComposeAPI
          .namespaceUpdateTranslations({ namespaceID, translations })
          .then(() => {
            const lang = this.resourceTranslationLanguages[0]

            // When translations are successfully saved,
            // scan changes and apply them back to the passed object
            // not the most elegant solution but is saves us from
            // handling the resource on multiple places
            const find = (key) => {
              return translations.find(t => t.key === key && t.lang === lang && t.resource === this.resource)
            }

            let tr

            tr = find('name')
            if (tr !== undefined) {
              this.namespace.name = tr.message
            }

            tr = find('subtitle')
            if (tr !== undefined) {
              this.namespace.meta.subtitle = tr.message
            }

            tr = find('description')
            if (tr !== undefined) {
              this.namespace.meta.description = tr.message
            }
          })
      }
    },
  },
}
</script>

<template>
  <c-translator-button
    v-if="canManageResourceTranslations && resourceTranslationsEnabled"
    button-variant="light"
    class="btn-lg ml-auto mr-1 py-1 px-3"
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
    keyPrefix: 'resources.module.field',
  },

  props: {
    field: {
      type: compose.ModuleField,
      required: true,
    },

    module: {
      type: compose.Module,
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
      const { fieldID } = this.field
      const { moduleID, namespaceID } = this.module
      return `compose:module-field/${namespaceID}/${moduleID}/${fieldID}`
    },

    titles () {
      const { name } = this.field
      const titles = {}

      titles[this.resource] = this.$t('title', { name })

      return titles
    },

    fetcher () {
      const { moduleID, namespaceID } = this.module

      return () => {
        return this.$ComposeAPI
          .moduleListTranslations({ namespaceID, moduleID })
          // Fields do not have their own translation endpoints so we'll just
          // filter what we need here.
          .then(set => set.filter(({ resource }) => this.resource === resource))
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

            const tr = find('label')
            if (tr !== undefined) {
              this.field.label = tr.message
            }

            // tr = find('description.view')
            // if (tr !== undefined) {
            //   this.field.description.view = tr.message
            // }
            //
            // tr = find('description.edit')
            // if (tr !== undefined) {
            //   this.field.description.edit = tr.message
            // }
            //
            // tr = find('hint.view')
            // if (tr !== undefined) {
            //   this.field.hint.view = tr.message
            // }
            //
            // tr = find('hint.edit')
            // if (tr !== undefined) {
            //   this.field.hint.edit = tr.message
            // }
          })
      }
    },
  },
}
</script>

<template>
  <c-translation-button
    v-if="canManageResourceTranslations"
    button-variant="light"
    class="btn-lg ml-auto mr-1"
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

export default {
  props: {
    module: {
      type: compose.Module,
      required: true,
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
      return true || this.can('compose/', 'module-translations.manage')
    },

    resource () {
      const { moduleID, namespaceID } = this.module
      return `compose:module/${namespaceID}/${moduleID}`
    },

    titles () {
      const { handle, moduleID, namespaceID, fields } = this.module
      const titles = {}

      titles[this.resource] = this.$t('translator.module.title', { handle })

      fields.forEach(({ fieldID, name }) => {
        titles[`compose:module-field/${namespaceID}/${moduleID}/${fieldID}`] = this.$t('translator.module-field.title', { name })
      })

      return titles
    },

    fetcher () {
      const { moduleID, namespaceID } = this.module

      return () => {
        return this.$ComposeAPI.moduleListLocale({ namespaceID, moduleID })
      }
    },

    updater () {
      const { moduleID, namespaceID } = this.module

      return locale => {
        return this.$ComposeAPI.moduleUpdateLocale({ namespaceID, moduleID, locale })
      }
    },
  },
}
</script>

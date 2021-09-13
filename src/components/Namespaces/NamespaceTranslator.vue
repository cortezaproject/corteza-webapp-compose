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
    namespace: {
      type: compose.Namespace,
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
      return true || this.can('compose/', 'resource-translations.manage')
    },

    resource () {
      const { namespaceID } = this.namespace
      return `compose:namespace/${namespaceID}`
    },

    titles () {
      const { slug: handle } = this.namespace
      const titles = {}

      titles[this.resourceID] = this.$t('translator.namespace.title', { handle })

      return titles
    },

    fetcher () {
      const { namespaceID } = this.namespace

      return () => {
        return this.$ComposeAPI.namespaceListLocale({ namespaceID })
      }
    },

    updater () {
      const { namespaceID } = this.namespace

      return locale => {
        return this.$ComposeAPI.namespaceUpdateLocale({ namespaceID, locale })
      }
    },
  },
}
</script>

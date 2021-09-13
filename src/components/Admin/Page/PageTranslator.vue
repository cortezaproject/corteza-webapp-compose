<template>
  <c-translation-button
    v-if="canManageResourceTranslations"
    class="ml-auto mr-1"
    :button-variant="buttonVariant"
    :disabled="disabled"
    :resource="resource"
    :titles="titles"
    :fetcher="fetcher"
    :updater="updater"
    :highlight-key="highlightKey"
  />
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'
import { mapGetters } from 'vuex'

export default {
  props: {
    page: {
      type: compose.Page,
      required: true,
    },

    block: {
      type: compose.PageBlock,
      required: false,
    },

    buttonVariant: {
      type: String,
      default: () => 'primary',
    },

    highlightKey: {
      type: String,
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
      return true || this.can('compose/', 'page-translations.manage')
    },

    resource () {
      const { pageID, namespaceID } = this.page
      return `compose:page/${namespaceID}/${pageID}`
    },

    titles () {
      const titles = {}
      if (this.block) {
        const { title } = this.block

        console.log(this.block)

        titles[this.resource] = this.$t('translator.page-block.title', { title })
      } else {
        const { handle } = this.page

        titles[this.resource] = this.$t('translator.page.title', { handle })
      }

      return titles
    },

    fetcher () {
      const { pageID, namespaceID } = this.page

      return () => {
        const locales = this.$ComposeAPI.pageListLocale({ namespaceID, pageID })

        if (this.block) {
          /**
           * When block is set, intercept the resolved request and filter out the
           * translations that are relevant for that block
           *
           * @todo get the block ID out of the block
           */
          return locales.then(tt => tt.filter(({ key }) => key.startsWith('pageBlock.0')))
        }

        return locales
      }
    },

    updater () {
      const { pageID, namespaceID } = this.page

      return locale => {
        return this.$ComposeAPI.pageUpdateLocale({ namespaceID, pageID, locale })
      }
    },
  },
}
</script>

<template>
  <c-translator-button
    v-if="canManageResourceTranslations && resourceTranslationsEnabled"
    class="ml-auto mr-1"
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
    keyPrefix: 'resources.page',
  },

  props: {
    page: {
      type: compose.Page,
      required: true,
    },

    block: {
      type: compose.PageBlock,
      required: false,
      default: undefined,
    },

    buttonVariant: {
      type: String,
      default: () => 'primary',
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
      const { pageID, namespaceID } = this.page
      return `compose:page/${namespaceID}/${pageID}`
    },

    titles () {
      const titles = {}
      if (this.block) {
        const { title, blockID } = this.block

        titles[this.resource] = this.$t('block.title', { title, blockID })
      } else {
        const { pageID, handle } = this.page

        titles[this.resource] = this.$t('title', { handle: handle || pageID })
      }

      return titles
    },

    fetcher () {
      const { pageID, namespaceID } = this.page

      return () => {
        const locales = this.$ComposeAPI.pageListTranslations({ namespaceID, pageID })

        if (this.block) {
          /**
           * When block is set, intercept the resolved request and filter out the
           * translations that are relevant for that block
           *
           * @todo get the block ID out of the block
           */
          return locales.then(tt => tt.filter(({ key }) => key.startsWith(`pageBlock.${this.block.blockID}.`)))
        }

        return locales
      }
    },

    updater () {
      const { pageID, namespaceID } = this.page

      return translations => {
        return this.$ComposeAPI
          .pageUpdateTranslations({ namespaceID, pageID, translations })
          .then(() => {
            const lang = this.resourceTranslationLanguages[0]

            // When translations are successfully saved,
            // scan changes and apply them back to the passed object
            // not the most elegant solution but is saves us from
            // handling the resource on multiple places
            const find = (key) => {
              return translations.find(t => t.key === key && t.lang === lang && t.resource === this.resource)
            }

            let tr = find('title')
            if (tr !== undefined) {
              this.page.title = tr.message
            }

            tr = find('description')
            if (tr !== undefined) {
              this.page.description = tr.message
            }

            // this.page.blocks.forEach(b => {
            //   tr = find(`pageBlock.${b.blockID}.title`)
            //   console.log(`pageBlock.${b.blockID}.title`, tr)
            //   if (tr !== undefined) {
            //     b.title = tr.message
            //   }
            //
            //   tr = find(`pageBlock.${b.blockID}.description`)
            //   if (tr !== undefined) {
            //   }
            // })
          })
      }
    },
  },
}
</script>

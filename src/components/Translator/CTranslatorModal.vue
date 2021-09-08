<template>
  <div>
    <b-modal
      v-model="showModal"
      hide-footer
      size="xl"
      lazy
      scrollable
      @hide="onHide"
    >
      <c-translator-form
        v-if="loaded"
        :translations="translations"
        :languages="languages"
        :titles="titles"
        @submit="onSubmit"
      />
    </b-modal>
  </div>
</template>
<script lang="js">
import CTranslatorForm from './CTranslatorForm.vue'

export default {
  components: {
    CTranslatorForm,
  },

  data () {
    return {
      fetcher: undefined,
      updater: undefined,
      loaded: false,

      translations: [],
      titles: {},
    }
  },

  computed: {
    showModal: {
      get () {
        return !!this.fetcher
      },

      set (open) {
        if (!open) {
          this.clear()
        }
      },
    },

    languages () {
      const ll = new Set()
      for (const t of this.translations) {
        ll.add(t.lang)
      }

      return Array.from(ll).map(tag => ({ tag }))
    },
  },

  mounted () {
    this.$root.$on('c-translator', async ({ titles, fetcher, updater }) => {
      this.titles = titles

      this.fetcher = fetcher
      this.updater = updater

      this.translations = await fetcher()
      this.loaded = true
    })
  },

  destroyed () {
    this.$root.$off('c-translator')
  },

  methods: {
    onSubmit (translations) {
      this.updater(translations)
    },

    onHide () {
      this.clear()
    },

    clear () {
      this.title = undefined
      this.target = undefined
      this.fetcher = undefined
      this.updater = undefined
      this.loaded = false
    },
  },
}
</script>

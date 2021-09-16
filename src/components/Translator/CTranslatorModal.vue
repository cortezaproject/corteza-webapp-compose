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
        highlight-key="highlightKey"
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
      updater: undefined,
      loaded: false,

      translations: [],
      titles: {},
    }
  },

  computed: {
    showModal: {
      get () {
        return this.loaded
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
    this.loaded = false
    this.$root.$on('c-translator', payload => {
      if (!payload) {
        // when falsy payload is received,
        // close the translator modal
        this.clear()
        return
      }

      const { titles, fetcher, updater, highlightKey } = payload

      this.titles = titles
      this.highlightKey = highlightKey
      this.updater = updater

      fetcher().then(tt => {
        this.translations = tt
        this.loaded = true
      })
    })
  },

  destroyed () {
    this.$root.$off('c-translator')
  },

  methods: {
    onSubmit (translations) {
      if (translations.length === 0) {
        // no translations were changed or added
        // we can close the modal w/o saving
        this.clear()
        return
      }

      this.updater(translations)
        .then(() => this.clear())
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

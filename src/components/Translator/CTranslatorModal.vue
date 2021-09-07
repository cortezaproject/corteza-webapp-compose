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
        v-if="resource"
        :translations="translations"
        :languages="languages"
        :titles="titles"
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
      resource: undefined,

      translations: [
        // @todo replace with the actual data
        { resource: 'compose:module/34082935092', lang: 'sl', key: 'name', msg: 'slovensko ime' },
        { resource: 'compose:module/34082935092', lang: 'en', key: 'name', msg: 'english name' },
        { resource: 'compose:module/34082935092', lang: 'en', key: 'name', msg: 'de name' },
        { resource: 'compose:module/34082935092', lang: 'sl', key: 'description', msg: 'Kontakt' },
        { resource: 'compose:module/34082935092', lang: 'en', key: 'description', msg: 'Kontakt' },
        { resource: 'compose:module-field/582375902375', lang: 'en', key: 'name', msg: 'Contact' },
        { resource: 'compose:module-field/582375902375', lang: 'sl', key: 'name', msg: 'Contact' },
        { resource: 'compose:module-field/582375902375', lang: 'en', key: 'description', msg: 'Contact' },
        { resource: 'compose:module-field/582375902375', lang: 'sl', key: 'description', msg: 'Contact' },
        { resource: 'compose:module-field/582375902373', lang: 'en', key: 'description', msg: 'Contact' },
        { resource: 'compose:module-field/582375902373', lang: 'sl', key: 'description', msg: 'Contact' },
      ],
      languages: [
        // @todo replace with the actual data
        { tag: 'sl' },
        { tag: 'en' },
        { tag: 'de' },
      ],
      titles: {},
    }
  },

  computed: {
    showModal: {
      get () {
        return !!this.resource
      },

      set (open) {
        if (!open) {
          this.clear()
        }
      },
    },
  },

  mounted () {
    this.$root.$on('c-translator', ({ resource, titles }) => {
      this.resource = resource
      this.titles = titles

      // @todo load resource translations from backend
      // const [component] = resource.split(':', 1)
      // const API = this[`$${component}API`]
    })
  },

  destroyed () {
    this.$root.$off('c-translator')
  },

  methods: {
    onHide () {
      this.clear()
    },

    clear () {
      this.resource = undefined
      this.title = undefined
      this.target = undefined
    },
  },
}
</script>

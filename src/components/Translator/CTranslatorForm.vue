<template>
  <b-form @submit.prevent="onSubmit">
    <div
      class="text-right mb-2"
    >
      {{ $t('show-languages') }}
      <b-checkbox
        class="d-inline-block my-1 mx-2"
        v-for="lang in languages"
        v-model="lang.visible"
        :disabled="lang.visible && visibleLanguages.length < 2"
        :key="lang.tag"
      >
        {{ lang.tag }}
      </b-checkbox>
    </div>

    <b-card
      class="mb-2"
      v-for="(r, i) in resources()"
      :key="i"
      :header="r.title"
      header-bg-variant="light"
    >
      <b-row>
        <b-col
          cols="2"
        >
        </b-col>
        <b-col
          v-for="lang in visibleLanguages"
          :key="lang.tag"
          class="text-truncate"
        >
            {{ lang.tag }}
        </b-col>
      </b-row>
      <b-row
        v-for="(key, k) in keys(r.resource)"
        :key="k"
        :class="{'my-1 py-1': true, 'bg-light': key === highlightKey }"
      >
        <b-col
          cols="2"
          class="text-truncate"
        >
          {{ key }}
        </b-col>
        <b-col
          v-for="lang in visibleLanguages"
          :key="lang.tag"
        >
          <div
            :contenteditable="!disabled"
            @blur="onUpdate(r.resource, key, lang.tag, $event.target.innerText)"
          >
            {{ msg(r.resource, key, lang.tag) }}
          </div>
        </b-col>
      </b-row>
    </b-card>
    <b-row class="footer mt-3"
    >
      <b-col
        class="rule-list text-right"
        cols="9"
        offset="3"
      >
        <b-button
          type="submit"
          variant="primary"
          :disabled="disabled"
          @submit="onSubmit()"
        >
          {{ $t('save-changes') }}
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>
<script lang="js">

export default {
  i18nOptions: {
    namespaces: 'resource-translator',
    keyPrefix: 'translator',
  },

  props: {
    /**
     * Array of objects containing all relevant translations
     *
     * It is backend's responsibility to serve all relevant translations
     * for a certain resource
     */
    translations: {
      type: Array,
      required: true,
    },

    /**
     * Translation of resource types
     *
     * What we usually get for each translation is resource type like
     * compose:module/42 and this key/value allows us to map it to 'Module'
     * This is especially useful in case of fields when it's important that
     * translator can differentiate between them
     */
    titles: {
      type: Object,
      default: () => ({}),
    },

    /**
     * When set, the row in translator is is highlighted
     */
    highlightKey: {
      type: String,
    },

    disabled: {
      type: Boolean,
      default: () => false,
    },
  },

  data () {
    return {
      languages: [],
      intTranslations: this.translations.map(t => ({ ...t, org: t.message, dirty: false })),
    }
  },

  computed: {
    visibleLanguages () {
      return this.languages.filter(({ visible }) => visible)
    },
  },

  created () {
    this.languages = this.resourceTranslationLanguages.map(tag => ({ tag, visible: true }))
  },

  methods: {
    /**
     * Returns unique set of resources from the given values
     *
     * @returns object[]
     */
    resources () {
      return this.intTranslations
        .map(r => r.resource)
        .filter((r, i, rr) => rr.indexOf(r) === i)
        .map(resource => ({
          resource,
          title: this.titles[resource] || resource,
        }))
    },

    /**
     * Returns unique set of keys from from the given values for a specific resource
     *
     * @returns string[]
     */
    keys (resource) {
      return this.intTranslations
        .filter(r => r.resource === resource)
        .map(r => r.key)
        .filter((r, i, rr) => rr.indexOf(r) === i)
    },

    msg (resource, key, lang) {
      return (this.intTranslations.find(r => r.resource === resource && r.key === key && r.lang === lang) || { message: '' }).message
    },

    onUpdate (resource, key, lang, message) {
      const v = this.intTranslations.find(r => r.resource === resource && r.key === key && r.lang === lang)
      if (v === undefined) {
        this.intTranslations.push({ resource, key, lang, message, org: message, dirty: true })
      } else {
        // if new message is different then original, mark translation as dirty
        v.dirty = v.org !== message
        v.message = message
      }
    },

    onSubmit () {
      if (!this.disabled) {
        // collect all unsaved translations
        const dirty = this.intTranslations
          .filter(({ dirty }) => dirty)
          .map(({ resource, key, lang, message }) => ({ resource, key, lang, message }))

        // and pass them to parent component
        this.$emit('submit', dirty)
      }
    },
  },
}

</script>
<style lang="scss" scoped>
[contenteditable=true] {
  cursor: text;
}
</style>

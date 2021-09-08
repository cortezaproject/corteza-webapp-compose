<template>
  <b-form @submit.prevent="onSubmit">
    <div
      class="text-right mb-2"
    >
      {{ $t('translator.show-languages') }}
      <b-checkbox
        class="d-inline-block my-1 mx-2"
        v-for="lang in intLanguages"
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
      <b-row
        v-for="(key, k) in keys(r.resource)"
        :key="k"
        class="mt-1"
      >
        <b-col
          cols="2"
        >
          {{ key }}
        </b-col>
        <b-col
          v-for="lang in visibleLanguages"
          :key="lang.tag"
        >
          <b-input-group
            :prepend="lang.tag"
          >
            <b-input
              :disabled="disabled"
              :value="msg(r.resource, key, lang.tag)"
              @update="onUpdate(r.resource, key, lang.tag, $event)"
            />
          </b-input-group>
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
          {{ $t('translator.save-changes') }}
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>
<script lang="js">
// import { compose } from '@cortezaproject/corteza-js'

// Data, Methods, Computed, Props
export default {
  props: {
    /**
     * Using a dedicated prop for languages
     * because we want control over the order
     */
    languages: {
      type: Array,
      required: true,
    },

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

    disabled: {
      type: Boolean,
      default: () => false,
    },
  },

  data () {
    return {
      intLanguages: {},
      intTranslations: [],
    }
  },

  computed: {
    visibleLanguages () {
      return this.intLanguages.filter(({ visible }) => visible)
    },
  },

  mounted () {
    this.intTranslations = JSON.parse(JSON.stringify(this.translations))
    this.intLanguages = this.languages.map(({ tag }) => ({ tag, visible: true }))
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
      return (this.intTranslations.find(r => r.resource === resource && r.key === key && r.lang === lang) || { msg: '' }).msg
    },

    onUpdate (resource, key, lang, msg) {
      const v = this.intTranslations.find(r => r.resource === resource && r.key === key && r.lang === lang)
      if (v === undefined) {
        this.intTranslations.push({ resource, key, lang, msg })
      } else {
        v.msg = msg
      }
    },

    onSubmit () {
      if (!this.disabled) {
        this.$emit('submit', this.intTranslations)
      }
    },
  },
}

</script>

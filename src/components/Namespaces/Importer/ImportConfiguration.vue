<template>
  <b-card
    header-bg-variant="white"
    footer-bg-variant="white"
  >
    <b-form-group :label="$t('name.label')">
      <b-form-input
        v-model="name"
        class="mt-1"
        :placeholder="$t('name.placeholder')"
      />
    </b-form-group>

    <b-form-group :label="$t('slug.label')">
      <b-form-input
        v-model="slug"
        class="mt-1"
        :state="slugState"
        :placeholder="$t('slug.placeholder')"
      />
    </b-form-group>

    <div slot="footer">
      <b-button
        variant="outline-dark"
        class="float-left"
        @click="$emit('back')"
      >
        {{ $t('import.back') }}
      </b-button>

      <b-button
        variant="dark"
        :disabled="!canContinue"
        class="float-right"
        @click="nextStep"
      >
        {{ $t('import.import') }}
      </b-button>
    </div>
  </b-card>
</template>

<script>
import { handleState } from 'corteza-webapp-compose/src/lib/handle'

export default {
  i18nOptions: {
    namespaces: 'namespace',
  },

  props: {
    session: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data () {
    return {
      name: '',
      slug: '',
    }
  },

  computed: {
    canContinue () {
      return !!this.name && !!this.slug && this.slugState !== false
    },

    slugState () {
      return handleState(this.slug)
    },
  },

  methods: {
    nextStep () {
      if (!this.canContinue) {
        return
      }

      // convert to api's structure
      const rtr = {
        name: this.name,
        slug: this.slug,
      }

      this.$emit('configured', rtr)
    },
  },
}
</script>

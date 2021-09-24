<template>
  <b-card
    no-body
    footer-class="pb-3"
    class="h-100 shadow-sm mb-4"
    :class="{ 'pointer': namespace.enabled, 'shadow': hovered }"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    @click="visitNamespace()"
  >
    <b-card-img
      v-if="namespace.meta.logoEnabled"
      :src="logo"
      :alt="namespace.name"
      class="p-2"
    />

    <b-card-body
      class="mw-100"
    >
      <div
        class="d-flex align-items-center"
        :class="{ 'h-100': !namespace.meta.description }"
      >
        <div
          class="d-flex flex-column justify-content-center w-100"
          :class="{ 'align-items-start': showEdit, 'align-items-center': !showEdit }"
          :style="`min-height: 60px; ${showEdit ? 'max-width: 85%' : ''}`"
        >
          <h4
            class="d-inline-block text-truncate mb-0 mw-100"
          >
            {{ namespace.name }}
          </h4>
          <p
            v-if="namespace.meta.subtitle"
            class="d-inline-block mb-0 mt-1"
          >
            {{ namespace.meta.subtitle }}
          </p>
        </div>
        <b-button
          v-if="showEdit"
          :to="{ name: 'namespace.edit', params: { namespaceID: namespace.namespaceID } }"
          :aria-label="$t('edit') + ' ' + namespace.name"
          variant="light"
          size="lg"
          class="ml-auto"
          @click.stop
        >
          <font-awesome-icon :icon="['far', 'edit']" />
        </b-button>
      </div>

      <p
        v-if="namespace.meta.description"
        class="text-justify overflow-auto ns-description mb-0 mt-2"
      >
        {{ namespace.meta.description }}
      </p>
    </b-card-body>
  </b-card>
</template>
<script>
import logo from 'corteza-webapp-compose/src/themes/corteza-base/img/logo.png'

export default {
  i18nOptions: {
    namespaces: 'namespace',
  },

  props: {
    namespace: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      processing: false,
      hovered: undefined,
      logoAttachment: undefined,
    }
  },

  computed: {
    isEnabled () {
      return !!this.namespace.enabled
    },

    showEdit () {
      return this.hovered && this.namespace.canUpdateNamespace
    },

    logo () {
      return this.namespace.meta.logo || this.$Settings.attachment('ui.mainLogo', logo)
    },
  },

  methods: {
    visitNamespace () {
      if (this.namespace.enabled) {
        this.$router.push({ name: 'pages', params: { slug: (this.namespace.slug || this.namespace.namespaceID) } })
      }
    },
  },
}
</script>

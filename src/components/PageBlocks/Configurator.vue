<template>
  <b-tabs active-nav-item-class="bg-grey"
          nav-wrapper-class="bg-white border-bottom"
          card>

    <b-tab active :title="$t('general.label.general')">
      <div class="mh-tab overflow-auto">
        <b-form-group for="title" :label="$t('block.general.titleLabel')">
          <b-form-input
            v-model="block.title"
            type="text"
            class="form-control"
            id="title"
            :placeholder="$t('block.general.titlePlaceholder')">
          </b-form-input>
        </b-form-group>
        <b-form-group for="description" :label="$t('block.general.descriptionLabel')">
          <b-form-input
            v-model="block.description"
            type="text"
            class="form-control"
            id="description"
            :placeholder="$t('block.general.descriptionPlaceholder')">
          </b-form-input>
        </b-form-group>
        <b-form-group for="color" :label="$t('block.general.headerStyle')">
          <b-form-select id="color"
                          v-model="block.style.variants.headerText"
                          :options="textVariants"/>
        </b-form-group>
      </div>
    </b-tab>
    <page-block
      v-bind="{ ...$attrs, ...$props }"
      mode="configurator"
      v-on="$listeners"
      class="mh-tab overflow-auto"
    />
  </b-tabs>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'
import PageBlock from './index'

export default {
  components: {
    PageBlock,
  },

  props: {
    block: {
      type: compose.PageBlock,
      required: true,
    },
  },

  computed: {
    textVariants () {
      return [
        { value: 'dark', text: this.$t('block.general.style.default') },
        { value: 'primary', text: this.$t('block.general.style.primary') },
        { value: 'secondary', text: this.$t('block.general.style.secondary') },
        { value: 'success', text: this.$t('block.general.style.success') },
        { value: 'warning', text: this.$t('block.general.style.warning') },
        { value: 'danger', text: this.$t('block.general.style.danger') },
      ]
    },

    blockClass () {
      return [
        'text-' + this.block.style.variants.headerText,
      ]
    },
  },
}
</script>
<style scoped>
.mh-tab {
  max-height: calc(100vh - 16rem);
}
</style>

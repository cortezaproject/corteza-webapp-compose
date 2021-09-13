<template>
  <b-tabs active-nav-item-class="bg-grey"
          nav-wrapper-class="bg-white border-bottom"
          card>
    <template #tabs-end>
      <page-translator
        v-if="page"
        :page="page"
        :block="block"
        button-variant="link"
      />

    </template>
    <b-tab active :title="$t('general.label.general')">
      <div class="mh-tab overflow-auto">
        <b-form-group for="title" :label="$t('block.general.titleLabel')">
          <b-input-group>
            <b-form-input
              v-model="block.title"
              type="text"
              class="form-control"
              disabled
              id="title"
              :placeholder="$t('block.general.titlePlaceholder')">
            </b-form-input>
            <b-input-group-append>
              <page-translator
                v-if="page"
                :page="page"
                :block="block"
                highlight-key="pageBlock.0.title"
                button-variant="light"
              />
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-form-group for="description" :label="$t('block.general.descriptionLabel')">
          <b-input-group>
            <b-form-input
              v-model="block.description"
              type="text"
              class="form-control"
              id="description"
              disabled
              :placeholder="$t('block.general.descriptionPlaceholder')">
            </b-form-input>
            <b-input-group-append>
              <page-translator
                v-if="page"
                :page="page"
                :block="block"
                highlight-key="pageBlock.0.title"
                button-variant="light"
              />
            </b-input-group-append>
          </b-input-group>
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
import PageTranslator from 'corteza-webapp-compose/src/components/Admin/Page/PageTranslator'
import PageBlock from './index'

export default {
  components: {
    PageBlock,
    PageTranslator,
  },

  props: {
    block: {
      type: compose.PageBlock,
      required: true,
    },

    page: {
      type: compose.Page,
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

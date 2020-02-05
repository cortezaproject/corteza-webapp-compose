<template>
  <b-tabs active-nav-item-class="bg-grey"
          nav-wrapper-class="bg-white"
          active-tab-class="tab-content h-auto overflow-auto"
          card>

    <b-tab active :title="$t('general.label.general')">
      <div>
        <b-form-group for="title" :label="$t('block.general.titleLabel')">
          <b-form-input
            v-model="block.title"
            type="text"
            class="form-control form-control-sm"
            id="title"
            :placeholder="$t('block.general.titlePlaceholder')">
          </b-form-input>
        </b-form-group>
        <b-form-group for="description" :label="$t('block.general.descriptionLabel')">
          <b-form-input
            v-model="block.description"
            type="text"
            class="form-control form-control-sm"
            id="description"
            :placeholder="$t('block.general.descriptionPlaceholder')">
          </b-form-input>
        </b-form-group>
        <hr />
        <div class="row">
          <div class="col-sm-8">
            <b-form-input
              v-model="block.style.wrap.kind"
            />

            <b-form-group for="color" :label="$t('block.general.headerStyle')">
              <b-form-select id="color"
                              v-model="block.style.variants.headerText"
                              :options="textVariants"/>
            </b-form-group>
            <b-form-group>
              <b-form-radio-group
                v-model="block.style.variants.headerBg"
                :options="bgVariants"
              ></b-form-radio-group>
              <b-form-checkbox
                v-model="block.style.variants.border"
                class="mt-2"
                unchecked-value="0"
                :value="borderStyle"
              >{{ $t('block.general.border') }}</b-form-checkbox>
            </b-form-group>
            <b-form-group for="color" :label="$t('block.general.bodyStyle')">
              <b-form-radio-group id="color"
                                  v-model="block.style.variants.bodyBg"
                                  :options="bgVariants"/>
            </b-form-group>
          </div>
          <div class="col-sm-4 d-flex flex-column rounded-sm">
              <label>{{ $t('block.general.preview') }}</label>
              <p class="p-2 mb-0 border-bottom" :class="blockClass" >{{ block.title }}</p>
              <small class="px-2">{{ block.description }}</small>
              <div :class="'bg-'+block.style.variants.bodyBg" class=" p-2 flex-grow-1">
                {{ $t('block.general.previewBody') }}
              </div>
          </div>
        </div>
      </div>
    </b-tab>
    <page-block
      v-bind="{ ...$attrs, ...$props }"
      mode="configurator"
      v-on="$listeners"
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
        { value: 'primary', text: this.$t('block.general.style.default') },
        { value: 'secondary', text: this.$t('block.general.style.secondary') },
        { value: 'white', text: this.$t('block.general.style.white') },
        { value: 'light', text: this.$t('block.general.style.light') },
        { value: 'dark', text: this.$t('block.general.style.dark') },
        { value: 'success', text: this.$t('block.general.style.success') },
        { value: 'warning', text: this.$t('block.general.style.warning') },
        { value: 'danger', text: this.$t('block.general.style.danger') },
      ]
    },

    bgVariants () {
      return [
        { value: 'white', text: this.$t('block.general.style.whiteBg') },
        { value: 'light', text: this.$t('block.general.style.lightBg') },
        { value: 'dark', text: this.$t('block.general.style.darkBg') },
      ]
    },

    borderStyle () {
      return this.block.style.variants.headerText
    },

    blockClass () {
      return [
        'text-' + this.block.style.variants.headerText,
        'bg-' + this.block.style.variants.headerBg,
        'border-' + this.block.style.variants.border,
      ]
    },
  },

  watch: {
    'block.style.variants.headerText': {
      handler (v) {
        if (this.block.style.variants.border !== '0') {
          this.block.style.variants.border = v
        }
      },
    },
  },
}
</script>

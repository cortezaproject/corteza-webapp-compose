<template>
  <div class="container">
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
    <div class="row">
      <div class="col-sm-8">
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
            :value="block.style.variants.headerText"
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
    <hr>
    <component :is="block.kind"
               :namespace="namespace"
               :module="module"
               :page="page"
               :options.sync="block.options"/>
  </div>
</template>

<script>
import * as EditBlocks from './loader'

export default {
  components: {
    ...EditBlocks,
  },

  props: {
    block: {
      type: Object,
      required: true,
    },

    namespace: {
      type: Object,
      required: true,
    },

    page: {
      type: Object,
      required: true,
    },

    module: {
      type: Object,
      required: false,
    },
  },

  data () {
    return {
      textVariants: [
        { value: 'primary', text: this.$t('block.general.style.default') },
        { value: 'secondary', text: this.$t('block.general.style.secondary') },
        { value: 'white', text: this.$t('block.general.style.white') },
        { value: 'light', text: this.$t('block.general.style.light') },
        { value: 'dark', text: this.$t('block.general.style.dark') },
        { value: 'success', text: this.$t('block.general.style.success') },
        { value: 'warning', text: this.$t('block.general.style.warning') },
        { value: 'danger', text: this.$t('block.general.style.danger') },
      ],
      bgVariants: [
        { value: 'white', text: this.$t('block.general.style.whiteBg') },
        { value: 'light', text: this.$t('block.general.style.lightBg') },
        { value: 'dark', text: this.$t('block.general.style.darkBg') },
      ],
      borderVariants: [
        { value: '0', text: this.$t('block.general.style.noBorder') },
        { value: 'light', text: this.$t('block.general.style.lightBg') },
        { value: 'dark', text: this.$t('block.general.style.darkBg') },
      ],
    }
  },

  computed: {
    blockClass () {
      return [
        'text-' + this.block.style.variants.headerText,
        'bg-' + this.block.style.variants.headerBg,
        'border-' + this.block.style.variants.border,
      ]
    },
  },
}
</script>

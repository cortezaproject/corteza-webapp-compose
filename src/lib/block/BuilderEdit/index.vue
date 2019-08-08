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
                         v-model="block.style.variants.headerBg"
                         :options="bgVariants"/>
        </b-form-group>
        <b-form-group>
          <b-form-radio-group
            v-model="block.style.variants.headerText"
            :options="textVariants"
          ></b-form-radio-group>
        </b-form-group>
        <b-form-group for="color" :label="$t('block.general.bodyStyle')">
          <b-form-select id="color"
                         v-model="block.style.variants.bodyBg"
                         :options="bgVariants"/>
        </b-form-group>
      </div>
      <div class="col-sm-4 d-flex flex-column">
          <label>{{ $t('block.general.preview') }}</label>
          <p :class="blockClass" class="p-2 mb-0">{{ $t('block.general.previewHeader') }}</p>
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
      bgVariants: [
        { value: 'primary', text: this.$t('block.general.style.default') },
        { value: 'secondary', text: this.$t('block.general.style.secondary') },
        { value: 'white', text: this.$t('block.general.style.white') },
        { value: 'light', text: this.$t('block.general.style.light') },
        { value: 'dark', text: this.$t('block.general.style.dark') },
        { value: 'success', text: this.$t('block.general.style.success') },
        { value: 'warning', text: this.$t('block.general.style.warning') },
        { value: 'danger', text: this.$t('block.general.style.danger') },
      ],
      textVariants: [
        { value: 'dark', text: this.$t('block.general.style.darkText') },
        { value: 'white', text: this.$t('block.general.style.whiteText') },
      ],
    }
  },

  computed: {
    blockClass () {
      return [
        'bg-' + this.block.style.variants.headerBg,
        'text-' + this.block.style.variants.headerText,
      ]
    },
  },
}
</script>

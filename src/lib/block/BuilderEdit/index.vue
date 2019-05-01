<template>
  <form class="col-12">
    <fieldset class="form-group">
      <div class="form-group">
        <label for="title">{{ $t('block.general.titleLabel') }}</label>
        <input
          v-model="block.title"
          type="text"
          class="form-control form-control-sm"
          id="title"
          :placeholder="$t('block.general.titlePlaceholder')">
      </div>

      <div class="form-group">
        <label for="description">{{ $t('block.general.descriptionLabel') }}</label>
        <input
          v-model="block.description"
          type="text"
          class="form-control form-control-sm"
          id="description"
          :placeholder="$t('block.general.descriptionPlaceholder')">
      </div>
     <div class="form-group">
       <label for="color">{{ $t('block.general.headerStyle') }}</label>
       <b-form-select id="color" v-model="block.theme" :options="options" class="mb-3" />
       <div :class="'theme-'+block.theme">
         <h2>{{ $t('block.general.previewHeader') }}</h2>
       </div>
     </div>
    </fieldset>
    <component :is="block.kind" :namespace="namespace" :module="module" :page="page" :options.sync="block.options"/>
  </form>
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
      options: [
        { value: '', text: this.$t('block.general.style.default') },
        { value: 'red-light', text: this.$t('block.general.style.redLight') },
        { value: 'red-dark', text: this.$t('block.general.style.redDark') },
        { value: 'green-light', text: this.$t('block.general.style.greenLight') },
        { value: 'green-dark', text: this.$t('block.general.style.greenDark') },
        { value: 'blue-light', text: this.$t('block.general.style.blueLight') },
        { value: 'blue-dark', text: this.$t('block.general.style.blueDark') },
        { value: 'grey-light', text: this.$t('block.general.style.greyLight') },
        { value: 'grey-dark', text: this.$t('block.general.style.greyDark') },
        { value: 'yellow-dark', text: this.$t('block.general.style.yellowDark') },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/blocks.scss";

h2 {
  font-size: 15px;
  padding: 5px 10px;
}
</style>

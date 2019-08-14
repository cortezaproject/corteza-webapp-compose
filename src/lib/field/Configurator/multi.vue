<template>
  <b-form-group v-if="field.isMulti" class="mt-4">
    <label class="d-block">{{ $t('field.options.multiDelimiter.label') }}</label>
    <b-form-radio-group
      v-model="field.options.multiDelimiter"
      :options="selectOptions"
      stacked>
    </b-form-radio-group>

    <label for="custom-delimiter">{{ $t('field.options.multiDelimiter.customLabel') }}</label>
    <b-form-input id="custom-delimiter" v-model="field.options.multiDelimiter" :placeholder="$t('field.options.multiDelimiter.customPlaceholder')"></b-form-input>
  </b-form-group>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      selectOptions: [
        { text: this.$t('field.options.multiDelimiter.newline'), value: '\n' },
        { text: this.$t('field.options.multiDelimiter.comma'), value: ', ' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-top: 10px;
}
</style>

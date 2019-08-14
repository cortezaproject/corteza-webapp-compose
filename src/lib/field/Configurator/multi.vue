<template>
  <b-form-group v-if="field.isMulti" class="mt-4">
    <label class="mt-1">{{ $t('field.options.multiDelimiter.label') }}</label>
    <b-form-radio-group
      v-model="field.options.multiDelimiter"
      :options="selectOptions"
      stacked>
    </b-form-radio-group>

    <label class="mt-1" for="custom-delimiter">{{ $t('field.options.multiDelimiter.customLabel') }}</label>
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

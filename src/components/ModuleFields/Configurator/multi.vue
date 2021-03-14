<template>
  <div>
    <b-form-group v-if="field.isMulti"
                  :label="$t('field.options.multiDelimiter.label')">
      <b-form-radio-group v-model="field.options.multiDelimiter"
                          :options="selectOptions"
                          stacked>
      </b-form-radio-group>
      <b-form-group class="mt-2" :label="$t('field.options.multiDelimiter.customLabel')">
        <b-form-input v-model="field.options.multiDelimiter" :placeholder="$t('field.options.multiDelimiter.customPlaceholder')"/>
      </b-form-group>
    </b-form-group>
  </div>
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

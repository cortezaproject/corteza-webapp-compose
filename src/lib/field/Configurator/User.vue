<template>
  <div>
    <div class="form-group"><b-form-checkbox plain v-model="f.options.presetWithAuthenticated">{{ $t('field.kind.user.presetWithCurrentUser') }}</b-form-checkbox></div>
    <div v-if="f.isMulti" class="form-group">
      <label class="d-block">{{ $t('field.kind.select.optionType.label') }}</label>
      <b-form-radio-group
        v-model="f.options.selectType"
        :options="selectOptions"
        stacked
      ></b-form-radio-group>
    </div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      selectOptions: [
        { text: this.$t('field.kind.select.optionType.default'), value: 'default' },
        { text: this.$t('field.kind.select.optionType.multiple'), value: 'multiple' },
        { text: this.$t('field.kind.select.optionType.each'), value: 'each' },
      ],
    }
  },
}
</script>

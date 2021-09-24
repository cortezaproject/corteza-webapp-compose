<template>
  <div>
    <div>
      <label class="d-block">{{ $t('kind.bool.checkedValueLabel') }}</label>
      <b-form-input
        v-model="f.options.trueLabel"
        :placeholder="$t('kind.bool.checkedValuePlaceholder')"
      />
    </div>
    <div>
      <label class="d-block">{{ $t('kind.bool.uncheckedValueLabel') }}</label>
      <b-form-input
        v-model="f.options.falseLabel"
        :placeholder="$t('kind.bool.uncheckedValuePlaceholder')"
      />
    </div>
  </div>
</template>

<script>
import base from './base'

export default {
  i18nOptions: {
    namespaces: 'field',
  },

  extends: base,
}
</script>

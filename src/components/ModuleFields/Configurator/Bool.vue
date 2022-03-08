<template>
  <div>
    <b-form-group
      :label="$t('kind.bool.checkedValueLabel')"
    >
      <b-form-input
        v-model="f.options.trueLabel"
        :placeholder="$t('kind.bool.checkedValuePlaceholder')"
      />
    </b-form-group>
    <b-form-group
      :label="$t('kind.bool.uncheckedValueLabel')"
    >
      <b-form-input
        v-model="f.options.falseLabel"
        :placeholder="$t('kind.bool.uncheckedValuePlaceholder')"
      />
    </b-form-group>
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

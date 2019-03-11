<template>
  <div>
    <div>
      <label class="d-block">{{ $t('field.kind.bool.checkedValueLabel') }}</label>
      <b-form-input v-model="f.options.trueLabel" :placeholder="$t('field.kind.bool.checkedValuePlaceholder')" />
    </div>
    <div>
      <label class="d-block">{{ $t('field.kind.bool.uncheckedValueLabel') }}</label>
      <b-form-input v-model="f.options.falseLabel" :placeholder="$t('field.kind.bool.uncheckedValuePlaceholder')" />
    </div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>

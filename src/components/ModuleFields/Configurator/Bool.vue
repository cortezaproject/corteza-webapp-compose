<template>
  <div>
    <div>
      <label class="d-block">{{ $t('kind.bool.checkedValueLabel') }}</label>
      <b-input-group>
        <b-form-input
          v-model="f.options.trueLabel"
          :placeholder="$t('kind.bool.checkedValuePlaceholder')"
        />
        <b-input-group-append>
          <field-bool-translator
            v-if="field"
            :field="field"
            :module="module"
            :highlight-key="`meta.bool.true.label`"
            size="sm"
            :disabled="isNew"
            button-variant="light"
          />
        </b-input-group-append>
      </b-input-group>
    </div>
    <div>
      <label class="d-block">{{ $t('kind.bool.uncheckedValueLabel') }}</label>
      <b-input-group>
        <b-form-input
          v-model="f.options.falseLabel"
          :placeholder="$t('kind.bool.uncheckedValuePlaceholder')"
        />
        <b-input-group-append>
          <field-bool-translator
            v-if="field"
            :field="field"
            :module="module"
            :highlight-key="`meta.bool.false.label`"
            size="sm"
            :disabled="isNew"
            button-variant="light"
          />
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>
</template>

<script>
import base from './base'
import { NoID } from '@cortezaproject/corteza-js'
import FieldBoolTranslator from 'corteza-webapp-compose/src/components/Admin/Module/FieldBoolTranslator'

export default {
  i18nOptions: {
    namespaces: 'field',
  },

  components: {
    FieldBoolTranslator,
  },

  extends: base,

  computed: {
    isNew () {
      return this.module.moduleID === NoID || this.field.fieldID === NoID
    },
  },
}
</script>

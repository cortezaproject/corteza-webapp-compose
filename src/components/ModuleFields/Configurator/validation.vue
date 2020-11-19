<template>
  <div>
    <b-form-group
      class="mt-3"
      :label="$t('field.sanitizers.label')"
      label-size="lg"
    >
      <field-expressions
        v-model="field.expressions.sanitizers"
        @append="field.expressions.sanitizers.push('')"
        @remove="field.expressions.sanitizers.splice($event,1)"
      />
      <b-form-text>
        info about what field value sanitizers are
      </b-form-text>
    </b-form-group>

    <hr />

    <b-form-group
      class="mt-3"
      :label="$t('field.validators.label')"
      label-size="lg"
    >
      <field-expressions
        v-model="field.expressions.validators"
        @append="field.expressions.validators.push({ test: '', error: '' })"
        @remove="field.expressions.validators.splice($event,1)"
        v-slot:default="{ value }"
      >
        <b-form-input
          v-model="value.test"
          :placeholder="$t('field.expression.placeholder')"
        />
        <b-input-group-prepend>
          <b-button variant="warning">!</b-button>
        </b-input-group-prepend>
        <b-form-input
          v-model="value.error"
          :placeholder="$t('field.error.placeholder')"
        />
      </field-expressions>
      <b-checkbox
        v-model="field.expressions.disableDefaultValidators"
        :disabled="field.expressions.validators.length === 0"
        :value="true"
        :unchecked-value="false"
        class="mt-2"
      >
        Disable built-in validators
      </b-checkbox>

      <b-form-text>
        info about what field value validators are
      </b-form-text>
    </b-form-group>

    <hr />

    <b-form-group
      class="mt-3"
      :label="$t('field.formatters.label')"
      label-size="lg"
    >
      <field-expressions
        v-model="field.expressions.formatters"
        @append="field.expressions.formatters.push('')"
        @remove="field.expressions.formatters.splice($event,1)"
      />

      <b-form-text>
        info about what field value formatters are
      </b-form-text>

      <b-checkbox
        v-model="field.expressions.disableDefaultFormatters"
        :disabled="field.expressions.formatters.length === 0"
        :value="true"
        :unchecked-value="false"
        class="mt-2"
      >
        Disable built-in formatter
      </b-checkbox>
    </b-form-group>
    <pre>{{ field.expressions }}</pre>
  </div>
</template>

<script>
import FieldExpressions from 'corteza-webapp-compose/src/components/Common/Module/FieldExpressions'
import { compose } from '@cortezaproject/corteza-js'

export default {
  components: {
    FieldExpressions,
  },

  props: {
    field: {
      type: compose.ModuleField,
      required: true,
    },
  },

  data () {
    return {
    }
  },

  mounted () {
    if (!this.field.expressions.sanitizers) {
      this.$set(this.field.expressions, 'sanitizers', [])
    }

    if (!this.field.expressions.validators) {
      this.$set(this.field.expressions, 'validators', [])
    }

    if (!this.field.expressions.disableDefaultValidators) {
      this.$set(this.field.expressions, 'disableDefaultValidators', false)
    }

    if (!this.field.expressions.formatters) {
      this.$set(this.field.expressions, 'formatters', [])
    }

    if (!this.field.expressions.disableDefaultFormatters) {
      this.$set(this.field.expressions, 'disableDefaultFormatters', false)
    }
  },
}
</script>

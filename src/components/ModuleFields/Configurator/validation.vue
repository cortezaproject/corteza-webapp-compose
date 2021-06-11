<template>
  <div
    v-if="loaded"
  >
    <b-form-group
      :label="$t('field.sanitizers.label')"
      label-size="lg"
    >
      <template #label>
        <div
          class="d-flex"
        >
          {{ $t('field.sanitizers.label') }}

          <b-button
            variant="link"
            class="p-0 ml-1 mr-auto"
            @click="field.expressions.sanitizers.push('')"
          >
            {{ $t('field.sanitizers.add') }}
          </b-button>

          <b-button
            variant="link"
            class="p-0 ml-1"
            @click="openExpressionsHelp('sanitizer')"
          >
            {{ $t('field.sanitizers.examples') }}
          </b-button>
        </div>
      </template>
      <field-expressions
        v-model="field.expressions.sanitizers"
        :placeholder="$t('field.sanitizers.expression.placeholder')"
        @remove="field.expressions.sanitizers.splice($event,1)"
      />
      <b-form-text>
        {{ $t('field.sanitizers.description') }}
      </b-form-text>
    </b-form-group>

    <hr />

    <b-form-group
      class="mt-3"
      label-size="lg"
    >
      <template #label>
        <div
          class="d-flex"
        >
          {{ $t('field.validators.label') }}

          <b-button
            variant="link"
            class="p-0 ml-1 mr-auto"
            @click="field.expressions.validators.push({ test: '', error: '' })"
          >
            {{ $t('field.sanitizers.add') }}
          </b-button>

          <b-button
            variant="link"
            class="p-0 ml-1"
            @click="openExpressionsHelp('validator')"
          >
            {{ $t('field.sanitizers.examples') }}
          </b-button>
        </div>
      </template>

      <field-expressions
        v-model="field.expressions.validators"
        @remove="field.expressions.validators.splice($event,1)"
        v-slot:default="{ value }"
      >
        <b-form-input
          v-model="value.test"
          :placeholder="$t('field.validators.expression.placeholder')"
        />
        <b-input-group-prepend>
          <b-button variant="warning">!</b-button>
        </b-input-group-prepend>
        <b-form-input
          v-model="value.error"
          :placeholder="$t('field.validators.error.placeholder')"
        />
      </field-expressions>
      <b-checkbox
        v-model="field.expressions.disableDefaultValidators"
        :disabled="!field.expressions.validators || field.expressions.validators.length === 0"
        :value="true"
        :unchecked-value="false"
        class="mt-2"
      >
        {{ $t('field.validators.disableBuiltIn') }}
      </b-checkbox>

      <b-form-text>
        {{ $t('field.validators.description') }}
      </b-form-text>
    </b-form-group>
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
      loaded: false,
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

    this.loaded = true
  },

  methods: {
    openExpressionsHelp (anchor) {
      const helpRoute = this.$router.resolve({ name: 'field.expressions.help' })
      window.open(`${helpRoute.href}#${anchor}`, '_blank',
                                   `toolbar=no,
                                    location=no,
                                    status=no,
                                    menubar=no,
                                    scrollbars=yes,
                                    resizable=yes,
                                    width=960px,
                                    height=1080px`)
    },
  },
}
</script>

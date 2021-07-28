<template>
  <div>
    <b-form-checkbox
      v-model="field.isRequired"
      :disabled="!field.cap.required || showvalueExpr"
    >
      {{ $t('general.label.required') }}
    </b-form-checkbox>

    <b-form-checkbox
      v-model="field.isMulti"
      :disabled="!field.cap.multi"
    >
      {{ $t('general.label.multi') }}
    </b-form-checkbox>

    <b-form-checkbox
      v-model="showvalueExpr"
      :disabled="field.isRequired || defaultValueEnabled"
    >
      {{ $t('field.valueExpr.label') }}
    </b-form-checkbox>

    <b-form-checkbox
      :checked="defaultValueEnabled"
      :disabled="!!showvalueExpr || field.isMulti"
      @change="toggleDefaultValue()"
    >
      {{ $t('field.defaultValue') }}
    </b-form-checkbox>

    <hr>

    <b-form-group
      v-if="showvalueExpr"
      :label="$t('field.valueExpr.label')"
      class="mt-2"
    >
      <b-input-group>
        <b-input-group-append>
          <b-button variant="dark">ƒ</b-button>
        </b-input-group-append>
        <b-form-input
          :placeholder="$t('field.valueExpr.placeholder')"
          v-model="field.expressions.value"
        >
        </b-form-input>
        <b-input-group-append>
          <b-button
            variant="outline-secondary"
            @click="openExpressionsHelp()"
          >
            ?
          </b-button>
        </b-input-group-append>
      </b-input-group>
      <b-form-text>
        {{ $t('field.valueExpr.description') }}
      </b-form-text>
    </b-form-group>

    <b-form-group
      v-else-if="showDefaultField"
      :label="$t('field.defaultFieldValue')"
      class="mt-3 mb-0"
    >
      <field-editor
        valueOnly
        v-bind="mock"
      />
    </b-form-group>

    <hr v-if="showvalueExpr || showDefaultField">

    <b-form-checkbox
      :checked="noDescriptionEdit"
      @change="$set(field.options.description, 'edit', $event ? undefined : '')"
      tabindex="-1"
    >
      {{ $t('field.options.description.same') }}
    </b-form-checkbox>

    <b-form-group
      :label="$t(`field.options.description.label.${noDescriptionEdit ? 'default' : 'view'}`)"
      class="mt-2"
    >
      <b-form-input
        v-model="field.options.description.view"
        :placeholder="$t(`field.options.description.placeholder.${noDescriptionEdit ? 'default' : 'view'}`)"
      />
    </b-form-group>

    <b-form-group
      v-if="!noDescriptionEdit"
      :label="$t('field.options.description.label.edit')"
      class="mt-2"
    >
      <b-form-input
        v-model="field.options.description.edit"
        :placeholder="$t('field.options.description.placeholder.edit')"
      />
    </b-form-group>

    <hr>

    <b-form-checkbox
      :checked="noHintEdit"
      @change="$set(field.options.hint, 'edit', $event ? undefined : '')"
      tabindex="-1"
    >
      {{ $t('field.options.hint.same') }}
    </b-form-checkbox>

    <b-form-group
      :label="$t(`field.options.hint.label.${noHintEdit ? 'default' : 'view'}`)"
      class="mt-2"
    >
      <b-form-input
        v-model="field.options.hint.view"
        :placeholder="$t(`field.options.hint.placeholder.${noHintEdit ? 'default' : 'view'}`)"
      />
    </b-form-group>

    <b-form-group
      v-if="!noHintEdit"
      :label="$t('field.options.hint.label.edit')"
      class="mt-2"
    >
      <b-form-input
        v-model="field.options.hint.edit"
        :placeholder="$t('field.options.hint.placeholder.edit')"
      />
    </b-form-group>
  </div>
</template>

<script>
import FieldEditor from '../Editor'
import { compose, validator } from '@cortezaproject/corteza-js'
import { mapGetters } from 'vuex'

export default {
  components: {
    FieldEditor,
  },

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    field: {
      type: compose.ModuleField,
      required: true,
    },
  },

  data () {
    return {
      showvalueExpr: false,
      mock: {
        show: true,
        namespace: undefined,
        module: undefined,
        field: undefined,
        record: undefined,
        errors: new validator.Validated(),
      },
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    noDescriptionEdit () {
      return this.field.options.description.edit === undefined
    },

    noHintEdit () {
      return this.field.options.hint.edit === undefined
    },

    defaultValueEnabled () {
      return this.field.isMulti || !!this.field.defaultValue.length
    },

    showDefaultField () {
      return this.defaultValueEnabled && this.mock.show && this.mock.field
    },
  },

  watch: {
    'mock.record.values': {
      handler ({ defValField: dv }) {
        if (!Array.isArray(dv)) {
          dv = [dv]
        }

        // Transform to backend value struct
        this.field.defaultValue = dv.map(v => {
          if (v !== undefined && v.toString) {
            v = v.toString()
          }

          const defaultValue = {
            name: this.field.name,
          }

          if (v) {
            defaultValue.value = v
          }

          return defaultValue
        })
      },
      deep: true,
    },

    'field.options': {
      handler (options) {
        if (this.mock.field) {
          this.mock.field.options = options
        }
      },
      deep: true,
    },

    'field.isMulti': {
      handler (isMulti) {
        if (!this.field.defaultValue.length) {
          this.initMocks()
        }

        const { defValField } = this.mock.record.values

        if (isMulti) {
          if (defValField) {
            this.mock.record.values.defValField = Array.isArray(defValField) ? defValField : [defValField]
          }
        } else if (defValField) {
          this.mock.record.values.defValField = defValField[0]
        }

        this.mock.field.isMulti = isMulti
      },
    },
  },

  /**
   * Prepare mock values for default-value field editor
   */
  created () {
    let { defaultValue, isMulti, expressions } = this.field

    if (!defaultValue) {
      defaultValue = []
    }

    if (defaultValue.length || isMulti) {
      this.initMocks(defaultValue)
    }

    this.showvalueExpr = expressions.value && expressions.value.length > 0
    if (!this.field.expressions.value) {
      this.$set(this.field.expressions, 'value', '')
    }
  },

  beforeDestroy () {
    // Sanitize expression/required flag
    if (this.showvalueExpr) {
      this.field.required = false
      this.field.defaultValue = []
    } else {
      this.field.expressions.value = undefined
    }
  },

  methods: {
    initMocks (defaultValue = []) {
      if (this.field.isMulti) {
        defaultValue = defaultValue.map(v => v.value)
      } else {
        defaultValue = (defaultValue[0] || {}).value
      }

      this.mock.namespace = this.namespace
      this.mock.field = compose.ModuleFieldMaker(this.field)
      this.mock.field.apply({ label: this.mock.field.label || 'Default value' })
      this.mock.field.apply({ name: 'defValField' })
      this.mock.module = new compose.Module({ fields: [this.mock.field] }, this.namespace)
      this.mock.record = new compose.Record(this.mock.module, { defValField: defaultValue })
    },

    toggleDefaultValue () {
      if (this.defaultValueEnabled) {
        this.field.defaultValue = []
      } else {
        this.initMocks()
      }
    },

    openExpressionsHelp () {
      const helpRoute = this.$router.resolve({ name: 'field.expressions.help' })
      window.open(`${helpRoute.href}#valueExpressions`, '_blank',
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

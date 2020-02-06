<template>
  <div>
    <b-form-checkbox
      v-model="field.isRequired"
      :disabled="!field.cap.required"
      :value="true"
      :unchecked-value="false"
    >
      {{ $t('general.label.required') }}
    </b-form-checkbox>
    <b-form-checkbox
      v-model="field.isPrivate"
      :disabled="!field.cap.private"
      :value="true"
      :unchecked-value="false"
    >
      {{ $t('general.label.private') }}
    </b-form-checkbox>

    <hr />
    <b-form-group
      v-if="mock.field"
      :label="$t('field.defaultValue')"
      class="mt-3"
    >
      <field-editor
        class="mb-0"
        valueOnly
        v-bind="mock"
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
      mock: {
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
  },

  watch: {
    'mock.record.values': {
      handler ({ defValField: dv }) {
        if (!Array.isArray(dv)) {
          dv = [dv]
        }
        // Transform to backend value struct
        this.field.defaultValue = dv.map(v => {
          return { name: this.field.name, value: v }
        })
      },
      deep: true,
    },

    'field.options': {
      handler (options) {
        this.mock.field.options = options
      },
      deep: true,
    },

    'field.isMulti': {
      handler (isMulti) {
        const { defValField } = this.mock.record.values
        if (isMulti) {
          if (defValField) {
            this.mock.record.values.defValField = [defValField]
          } else {
            this.mock.record.values.defValField = []
          }
        } else {
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
    let { defaultValue, isMulti } = this.field
    if (!defaultValue) {
      defaultValue = []
    }
    if (isMulti) {
      defaultValue = defaultValue.map(v => v.value)
    } else {
      defaultValue = (defaultValue[0] || {}).value
    }

    this.mock.namespace = this.namespace
    this.mock.field = compose.ModuleFieldMaker(this.field)
    this.mock.field.apply({ name: 'defValField' })
    this.mock.module = new compose.Module({ fields: [this.mock.field] }, this.namespace)
    this.mock.record = new compose.Record(this.mock.module, { defValField: defaultValue })
  },
}
</script>

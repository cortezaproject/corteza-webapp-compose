<template>
  <div>
    <b-form-checkbox v-model="field.isRequired"
                     :value="true"
                     :unchecked-value="false">

      {{ $t('general.label.required') }}
    </b-form-checkbox>
    <b-form-checkbox v-model="field.isPrivate"
                     :value="true"
                     :unchecked-value="false">
      {{ $t('general.label.private') }}
    </b-form-checkbox>
    <b-form-group v-if="mockField.kind"
                  :label="$t('field.defaultValue')"
                  class="mt-3">

      <field-editor class="mb-0"
                    valueOnly
                    :namespace="mockNamespace"
                    :field="mockField"
                    :record.sync="mockRecord" />
    </b-form-group>
  </div>
</template>

<script>
import FieldEditor from 'corteza-webapp-compose/src/lib/field/Editor'
import Field from 'corteza-webapp-compose/src/lib/field'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import { mapGetters } from 'vuex'

export default {
  components: {
    FieldEditor,
  },

  props: {
    field: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data () {
    return {
      mockNamespace: {
        namespaceID: undefined,
      },
      mockRecord: {
        values: {
          defaultValue: undefined,
        },
      },
      mockField: null,
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),
  },

  watch: {
    'mockRecord.values': {
      handler ({ defaultValue }) {
        if (!Array.isArray(defaultValue)) {
          defaultValue = [defaultValue]
        }
        // Transform to backend value struct
        this.field.defaultValue = defaultValue.map(v => {
          return { 'name': this.field.name, 'value': v }
        })
      },
      deep: true,
    },

    'field.options': {
      handler (options) {
        this.mockField.options = options
      },
      deep: true,
    },

    'field.isMulti': {
      handler (isMulti) {
        const { defaultValue } = this.mockRecord.values
        if (isMulti) {
          if (defaultValue) {
            this.mockRecord.values.defaultValue = [defaultValue]
          } else {
            this.mockRecord.values.defaultValue = []
          }
        } else {
          this.mockRecord.values.defaultValue = defaultValue[0]
        }
        this.mockField.isMulti = isMulti
      },
    },

  },

  created () {
    // Get namespaceID
    if (this.field.kind === 'Record') {
      this.mockNamespace.namespaceID = this.getModuleByID(this.$route.params.moduleID).namespaceID
    }

    // Prepare mocks for defaultValue editor
    // Transform to frontend value struct
    let { defaultValue, isMulti } = this.field
    if (!defaultValue) {
      defaultValue = []
    }
    if (isMulti) {
      defaultValue = defaultValue.map(v => v.value)
    } else {
      defaultValue = (defaultValue[0] || {}).value
    }

    // Create mock field for defaultValue fiels
    this.mockField = new Field(this.field)
    this.mockField.isRequired = false
    this.mockField.isPrivate = false
    this.mockField.name = 'defaultValue'

    // Create mock field for defaultValue
    const mockModule = { fields: [this.mockField] }
    this.mockRecord.values.defaultValue = defaultValue
    this.mockRecord = new Record(mockModule, this.mockRecord)
  },
}
</script>

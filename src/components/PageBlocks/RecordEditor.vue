<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div
      v-if="record"
      class="px-3"
    >
      <div
        v-for="field in fields"
        :key="field.id"
        class="mt-3"
      >
        <field-editor
          v-if="isFieldEditable(field)"
          v-bind="{ ...$props, errors: fieldErrors(field.name) }"
          class="field"
          :field="field"
        />
        <div
          v-else
        >
          <label
            class="text-primary mb-0"
            :class="{ 'mb-0': !!(field.options.description || {}).view || false }"
          >
            {{ field.label || field.name }}
          <hint
            :text="(field.options.hint || {}).view || ''"
            :id="field.fieldID"
            class="d-inline-block"
          />
          </label>

          <small
            class="text-muted"
          >
            {{ (field.options.description || {}).view }}
          </small>
          <div
            v-if="field.canReadRecordValue"
            class="value"
          >
            <field-viewer
              :field="field"
              v-bind="{ ...$props, errors: fieldErrors(field.name) }"
              value-only
            />
          </div>
          <div
            v-else
          >
            <i
              class="text-primary"
            >
              {{ $t('field.noPermission') }}
            </i>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="p-3 text-light bg-danger h-100"
    >
      {{ $t('block.record.preview.blockNoRecord') }}
    </div>
  </wrap>
</template>
<script>
import { validator, NoID } from '@cortezaproject/corteza-js'
import base from './base'
import users from 'corteza-webapp-compose/src/mixins/users'
import FieldEditor from 'corteza-webapp-compose/src/components/ModuleFields/Editor'
import FieldViewer from 'corteza-webapp-compose/src/components/ModuleFields/Viewer'
import Hint from 'corteza-webapp-compose/src/components/Common/Hint.vue'

export default {
  components: {
    FieldEditor,
    FieldViewer,
    Hint,
  },

  extends: base,

  mixins: [
    users,
  ],

  props: {
    errors: {
      type: validator.Validated,
      required: false,
    },
  },

  computed: {
    fields () {
      if (!this.module) {
        // No module, no fields
        return []
      }

      if (!this.options.fields || this.options.fields.length === 0) {
        // No fields defined in the options, show all (buy system)
        return this.module.fields.slice().sort((a, b) => a.label.localeCompare(b.label))
      }

      // Show filtered & ordered list of fields
      return this.module.filterFields(this.options.fields)
    },

    errorID () {
      const { recordID = NoID } = this.record || {}
      return recordID === NoID ? 'parent:0' : recordID
    },
  },

  created () {
    if (this.record.recordID) {
      this.fetchUsers(this.fields, [this.record])
    }
  },

  methods: {
    /**
     * Returns errors, filtered for a specific field
     * @param name
     * @returns {validator.Validated} filtered validation results
     */
    fieldErrors (name) {
      if (!this.errors) {
        return new validator.Validated()
      }

      return this.errors
        .filterByMeta('field', name)
        .filterByMeta('id', this.errorID)
    },

    isFieldEditable (field) {
      return field &&
        field.canUpdateRecordValue &&
        !field.isSystem &&
        !(
          field.expressions &&
          field.expressions.value
        )
    },
  },
}
</script>
<style lang="scss">
.value {
  min-height: 1.2rem;
}
</style>

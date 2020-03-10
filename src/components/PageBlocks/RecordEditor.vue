<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div
      v-if="record"
      class="p-3 h-100"
    >
      <div
        v-for="field in fields"
        :key="field.id"
        class="field"
      >
        <field-editor
          v-if="field.canUpdateRecordValue"
          v-bind="{ ...$props, errors: fieldErrors(field.name) }"
          class="field"
          :field="field"
        />
        <div
          v-else-if="field.canReadRecordValue"
          class="field"
        >
          <label>
            {{ field.label || field.name }}
          </label>
          <field-viewer
            :field="field"
            v-bind="$props"
          />
        </div>
        <div
          v-else
        >
          <label>{{ field.label || field.name }}</label>
          <i
            class="text-secondary"
          >
            {{ $t('field.noPermission') }}
          </i>
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
import FieldEditor from 'corteza-webapp-compose/src/components/ModuleFields/Editor'
import FieldViewer from 'corteza-webapp-compose/src/components/ModuleFields/Viewer'
import users from 'corteza-webapp-compose/src/mixins/users'
import base from './base'
import { validator } from '@cortezaproject/corteza-js'

export default {
  components: {
    FieldEditor,
    FieldViewer,
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
      return this.module.filterFields(this.options.fields)
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

      return this.errors.filterByMeta('field', name)
    },
  },
}
</script>

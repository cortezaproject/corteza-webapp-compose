<template>
  <div>
    <div v-for="field in fields" :key="field.id">
      <field-editor
        v-if="field.canUpdateRecordValue"
        v-bind="{ ...$props, errors: fieldErrors(field.name) }"
        class="field"
        :field="field"
      />

      <div v-else-if="field.canReadRecordValue" class="field">
        <label>{{ field.label || field.name }}</label>
        <field-viewer
          :field="field"
          v-bind="$props"
        />
      </div>

      <div v-else class="field">
        <label>{{ field.label || field.name }}</label>
        <i>{{ $t('field.noPermission') }}</i>
      </div>
    </div>
  </div>
</template>
<script>
import FieldEditor from 'corteza-webapp-compose/src/components/ModuleFields/Editor'
import FieldViewer from 'corteza-webapp-compose/src/components/ModuleFields/Viewer'
import users from 'corteza-webapp-compose/src/mixins/users'
import base from './base'

export default {
  components: {
    FieldEditor,
    FieldViewer,
  },

  extends: base,

  mixins: [
    users,
  ],

  computed: {
    fields () {
      return this.module.filterFields(this.options.fields)
    },
  },

  created () {
    if (!this.record.recordID) {
      const userFields = []
      this.fields.forEach(({ name, kind, isMulti }) => {
        if (kind === 'User') {
          userFields.push({ name, isMulti })
        }
      })
      this.fetchUsers(userFields, [this.record])
    }
  },

  methods: {
    /**
     * Returns errors, filtered for a specific field
     * @param name
     * @returns {validator.Validated} filtered validation results
     */
    fieldErrors (name) {
      return this.errors.filterByMeta('field', name)
    },
  },
}
</script>
<style scoped lang="scss">

.field {
  margin-bottom: 10px;

  label {
    font-weight: 900;
    display: block;
    font-size: 12px;
    font-family: $bold;
  }

  div {
    min-width: 200px;
    display: inline-block;
  }

  i {
    color: $secondary;
  }
}
</style>

<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div
      v-if="module && record"
      class="p-0"
    >
      <div
        v-for="(field, index) in fields"
        class="p-2 border-bottom border-light"
        :key="index">
        <label
          class="text-secondary small"
        >
          {{ field.label || field.name }}
        </label>
        <div
          v-if="field.canReadRecordValue"
          class="value"
        >
          <field-viewer
            v-bind="{ ...$props, field }"
            value-only
          />
        </div>
        <div
          v-else
          class="text-warning"
        >
          {{ $t('field.noPermission') }}
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
import base from './base'
import FieldViewer from 'corteza-webapp-compose/src/components/ModuleFields/Viewer'
import users from 'corteza-webapp-compose/src/mixins/users'

export default {
  components: {
    FieldViewer,
  },

  extends: base,

  mixins: [
    users,
  ],

  computed: {
    fields () {
      if (!this.module) {
        // No module, no fields
        return []
      }

      if (!this.options.fields || this.options.fields.length === 0) {
        // No fields defined in the options, show all (buy system)
        return this.module.fields
      }

      // Show filtered & ordered list of fields
      return this.module.filterFields(this.options.fields)
    },
  },

  watch: {
    record: {
      handler: function () {
        this.fetchUsers(this.fields, [this.record])
      },
      deep: true,
      immediate: true,
    },
  },

}
</script>
<style lang="scss">
.value {
  min-height: 1.2rem;
}
</style>

<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div
      v-if="module && record"
    >
      <div
        v-for="(field, index) in fields"
        class="d-flex flex-column mt-3 px-3"
        :key="index"
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
          class="value mt-2"
        >
          <field-viewer
            v-bind="{ ...$props, field }"
            value-only
          />
        </div>
        <i
          v-else
          class="text-primary"
        >
          {{ $t('field.noPermission') }}
        </i>
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
import Hint from 'corteza-webapp-compose/src/components/Common/Hint.vue'
import users from 'corteza-webapp-compose/src/mixins/users'

export default {
  components: {
    FieldViewer,
    Hint,
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
        return this.module.fields.slice().sort((a, b) => a.label.localeCompare(b.label))
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

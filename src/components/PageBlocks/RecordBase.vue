<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div
      v-if="module && record"
      class="p-3 record"
    >
      <div
        v-for="(field, index) in fields"
        class="mb-2"
        :key="index">
        <label
          class="font-weight-bold"
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
        <i
          v-else
          class="text-secondary"
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
      return this.module ? this.module.filterFields(this.options.fields) : []
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

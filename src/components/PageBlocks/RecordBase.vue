<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div
      v-if="record && options"
      class="p-2 record"
    >
      <div
        v-for="(field, index) in fields"
        class="field"
        :key="index">
        <label>{{ field.label || field.name }}</label>
        <div v-if="field.canReadRecordValue">
          <field-viewer :namespace="namespace"
                        :field="field"
                        :record="record"
                        value-only />
        </div>
        <i v-else>{{ $t('field.noPermission') }}</i>
      </div>
    </div>
    <div
      v-else
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
<style scoped lang="scss">

.record {
  .field {
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
}
</style>

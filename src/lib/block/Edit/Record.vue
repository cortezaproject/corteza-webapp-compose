<template>
  <div>
    <div v-for="field in fields" :key="field.id">
      <field-editor
        v-if="field.canUpdateRecordValue"
        class="field"
        :record.sync="record"
        :namespace="namespace"
        :field="field" />

      <div v-else-if="field.canReadRecordValue" class="field">
        <label>{{ field.label || field.name }}</label>
        <field-viewer
          :record.sync="record"
          :namespace="namespace"
          :field="field" />
      </div>

      <div v-else class="field">
        <label>{{ field.label || field.name }}</label>
        <i>{{ $t('field.noPermission') }}</i>
      </div>
    </div>
  </div>
</template>
<script>
import FieldEditor from 'corteza-webapp-compose/src/lib/field/Editor'
import FieldViewer from 'corteza-webapp-compose/src/lib/field/Viewer'

export default {
  components: {
    FieldEditor,
    FieldViewer,
  },

  props: {
    options: {
      type: Object,
      required: true,
    },

    module: {
      type: Object,
      required: true,
    },

    namespace: {
      type: Object,
      required: true,
    },

    record: {
      type: Object,
      required: false, // actually true, but we'll going to fail soft here
    },
  },

  computed: {
    fields () {
      return this.module.filterFields(this.options.fields)
    },
  },

  created () {
    if (!this.record.recordID) {
      this.fields.forEach(({ name, defaultValue, isMulti }) => {
        if (defaultValue) {
          if (isMulti) {
            defaultValue = defaultValue.map(v => v.value)
          } else {
            defaultValue = defaultValue[0].value
          }
          this.record.values[name] = defaultValue
        }
      })
    }
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

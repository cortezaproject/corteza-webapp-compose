<template>
  <div>
    <b-button
      size="lg"
      variant="light"
      v-b-modal.columns
    >
      {{ $t('allRecords.columns.title') }}
    </b-button>

    <b-modal
      id="columns"
      size="lg"
      :title="$t('allRecords.columns.title')"
      :ok-title="$t('general.label.saveAndClose')"
      body-class="p-0"
      @ok="onSave"
    >
      <div
        class="card-body"
      >
        <field-picker
          :module="module"
          :fields.sync="filteredFields"
          :search-label="$t('block:recordList.fields')"
        />
        <small
          class="pl-1"
        >
          {{ $t('allRecords.columns.description') }}
        </small>
      </div>
    </b-modal>
  </div>
</template>

<script>
import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'

export default {
  i18nOptions: {
    namespaces: 'module',
  },

  components: {
    FieldPicker,
  },

  props: {
    module: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    fields: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data () {
    return {
      filteredFields: [],
    }
  },
  created () {
    this.filteredFields = this.fields.map(f => {
      return { ...f.moduleField }
    })
  },
  methods: {
    onSave () {
      this.$emit('updateFields', this.filteredFields)
      this.showModal = false
    },
  },
}
</script>

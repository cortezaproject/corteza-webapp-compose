<template>
  <div>
    <b-button
      v-b-modal.columns
      size="lg"
      variant="light"
    >
      {{ $t('allRecords.columns.title') }}
    </b-button>

    <b-modal
      id="columns"
      size="lg"
      scrollable
      :title="$t('allRecords.columns.title')"
      :ok-title="$t('general.label.saveAndClose')"
      body-class="p-0"
      @ok="onSave"
    >
      <b-card-body
        class="d-flex flex-column mh-100"
      >
        <p>
          {{ $t('allRecords.columns.description') }}
        </p>
        <field-picker
          :module="module"
          :fields.sync="filteredFields"
          :labels="{
            searchPlaceholder: $t('field:selector.search'),
            availableFields: $t('field:selector.available'),
            selectAllFields: $t('field:selector.selectAll'),
            selectedFields: $t('field:selector.selected'),
            unselectAllFields: $t('field:selector.unselectAll'),
            systemFieldLabel: $t('field:selector.systemField'),
          }"
          class="d-flex flex-column"
        />
      </b-card-body>
    </b-modal>
  </div>
</template>

<script>
import { components } from '@cortezaproject/corteza-vue'
const { FieldPicker } = components

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

<style lang="scss" scoped>
.fit-modal {
  max-height: calc(100% - 3.5rem);
}
</style>

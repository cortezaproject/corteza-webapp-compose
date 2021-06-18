<template>
  <div>
    <b-button
      size="lg"
      variant="light"
      v-b-modal.selectFields
    >
      {{ $t('module.allRecords.selectFields.title') }}
    </b-button>

    <b-modal
      id="selectFields"
      size="lg"
      :title="$t('module.allRecords.selectFields.title')"
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
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'

export default {
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

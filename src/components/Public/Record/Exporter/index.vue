<template>
  <div>
    <b-button @click="toggleModal"
              size="sm"
              variant="outline-primary">

      {{ $t('general.label.export') }}
    </b-button>
    <b-modal
      :visible="showExportModal"
      @hide="toggleModal"
      size="lg"
      title="Export"
      hide-footer
      body-class="p-0">

      <field-picker
        :module="module"
        :recordCount="records.length"
        v-on="$listeners" />

    </b-modal>
  </div>
</template>

<script>
import FieldPicker from './FieldPicker'

export default {
  components: {
    FieldPicker,
  },

  props: {
    module: {
      type: Object,
      required: true,
    },
    records: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      showExportModal: false,
    }
  },

  methods: {
    toggleModal () {
      this.showExportModal = !this.showExportModal
    },
  },
}
</script>

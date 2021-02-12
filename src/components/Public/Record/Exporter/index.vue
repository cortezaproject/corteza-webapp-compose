<template>
  <div>
    <b-button @click="toggleModal"
              size="lg"
              variant="light">
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
        v-bind="$attrs"
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

  inheritAttrs: true,

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

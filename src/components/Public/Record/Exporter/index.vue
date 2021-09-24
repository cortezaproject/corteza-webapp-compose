<template>
  <div>
    <b-button
      size="lg"
      variant="light"
      @click="toggleModal"
    >
      {{ $t('label.export') }}
    </b-button>
    <b-modal
      :visible="showExportModal"
      size="lg"
      title="Export"
      hide-footer
      body-class="p-0"
      @hide="toggleModal"
    >
      <field-picker
        v-bind="$attrs"
        v-on="$listeners"
      />
    </b-modal>
  </div>
</template>

<script>
import FieldPicker from './FieldPicker'

export default {
  i18nOptions: {
    namespaces: 'general',
  },

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

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
        :recordCount="count"
        :query="query"
        v-on="$listeners" />

    </b-modal>
  </div>
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'
import FieldPicker from './FieldPicker'

export default {
  components: {
    FieldPicker,
  },

  props: {
    module: {
      type: compose.Module,
      required: true,
    },

    count: {
      type: Number,
      required: true,
    },

    query: {
      type: String,
      required: false,
      default: undefined,
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

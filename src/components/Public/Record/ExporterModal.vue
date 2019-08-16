<template>
  <div>
    <b-button @click="toggleModal" variant="link">
      <font-awesome-icon :icon="['fas', 'cloud-download-alt']" />
      {{ $t('general.label.export') }}
    </b-button>
    <b-modal
      :visible="showExportModal"
      @hide="toggleModal"
      size="lg"
      title="Export"
      hide-footer
      body-class="p-0">

      <exporter :module="module" :recordCount="records.length" />
    </b-modal>
  </div>
</template>

<script>
import Exporter from 'corteza-webapp-compose/src/components/Public/Record/Exporter'

export default {
  components: {
    Exporter,
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

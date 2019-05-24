<template>
  <b-button v-if="list.length > 0" variant="link" class="p-0" @click="jsonExport(list, type)">
    {{ $t('general.label.export') }}
  </b-button>
</template>

<script>
import { saveAs } from 'file-saver'

export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },

  methods: {
    jsonExport (list, type) {
      let blob = new Blob([JSON.stringify({ type, list }, null, 2)], { type: 'application/json' })
      saveAs(blob, `${type}-export.json`)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

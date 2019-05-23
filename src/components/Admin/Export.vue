<template>
  <a v-if="list.length > 0" class="action" @click="jsonExport(list, type)">
    <i class="icon-edit" />
  </a>
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
      let blob = new Blob([JSON.stringify({ type, list: list.map(m => m.export()) }, null, 2)], { type: 'application/json' })
      saveAs(blob, `${type}-export.json`)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

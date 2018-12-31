<template>
  <div v-if="module" class="preview">
    <div>
      Showing records from <code>{{ module.name || module.moduleID }}</code> module with
      columns: <code>{{ selectedFields }}</code>
    </div>

    <div v-if="options.hideAddButton"><b>Add record button</b> is hidden.</div>
    <div v-else>Users see <b>add record button</b>.</div>

    <div>
      <span v-if="options.hideSearch">Search inputbox is hidden.</span>
      <span v-else>Users search through the records.</span>
      <span v-if="options.prefilter">&nbsp;Results are prefiltered: <code>{{ options.prefilter }}</code>.</span>
    </div>

    <div>
      <span v-if="options.hideHeader">Table header is hidden.</span>
      <span v-else>Table header is shown.</span>
    </div>

    <div>
      <span v-if="options.hideSorting">Sorting is disabled</span>
      <span v-else>Sorting is enabled</span>
      <span v-if="options.prefilter">&nbsp;with presorted (<code>{{ options.presort }}</code>) records.</span>
    </div>

    <div>
      <span v-if="options.hidePaging">Results can not be paged.</span>
      <span v-else>Results can be paged.</span>
      <span v-if="options.perPage">&nbsp;<code>{{ options.perPage }}</code> records are shown per page.</span>
    </div>
  </div>
  <div v-else>Block with table of records, module not selected.</div>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'
import moduleLoaderMixin from './mixins/moduleLoader'

export default {
  computed: {
    selectedFields () {
      return this.options.fields.filter(f => !!f).map(f => f.name).join(', ')
    },
  },

  mixins: [
    optionsPropMixin,
    moduleLoaderMixin,
  ],
}
</script>
<style lang="scss">
.preview {
  > div {
    margin-bottom: 10px;
  }
}
</style>

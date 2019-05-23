<template>
  <div v-if="module" class="mb-1">
    <div>
      <i18next path="block.recordList.preview.recordFromModule" tag="label">
        <code>{{ module.name || module.moduleID }}</code>
        <code>{{ selectedFields }}</code>
      </i18next>
    </div>

    <div v-if="options.hideAddButton">
      <i18next path="block.recordList.preview.isHidden" tag="label">
        <b>{{ $t('block.recordList.preview.addRecordButton') }}</b>
      </i18next>
    </div>
    <div v-else>
      <i18next path="block.recordList.preview.usersSee" tag="label">
        <b>{{ $t('block.recordList.preview.addRecordButton') }}</b>
      </i18next>
    </div>

    <div>
      <span v-if="options.hideSearch">
        <i18next path="block.recordList.preview.isHidden" tag="label">
          <span>{{ $t('block.recordList.preview.searchInput') }}</span>
        </i18next>
      </span>
      <span v-else>{{ $t('block.recordList.preview.usersSearchThrough') }}</span>
      <span v-if="options.prefilter">&nbsp;{{ $t('block.recordList.preview.resultsPrefiltered') }} <code>{{ options.prefilter }}</code>.</span>
    </div>

    <div>
      <span v-if="options.hideHeader">
        <i18next path="block.recordList.preview.isHidden" tag="label">
          <span>{{ $t('block.recordList.preview.tableHeader') }}</span>
        </i18next>
      </span>
      <span v-else>
        <i18next path="block.recordList.preview.isShown" tag="label">
          <span>{{ $t('block.recordList.preview.tableHeader') }}</span>
        </i18next>
      </span>
    </div>

    <div>
      <span v-if="options.hideSorting">
        <i18next path="block.recordList.preview.isDisabled" tag="label">
          <span>{{ $t('block.recordList.preview.sorting') }}</span>
        </i18next>
      </span>
      <span v-else>
        <i18next path="block.recordList.preview.isEnabled" tag="label">
          <span>{{ $t('block.recordList.preview.sorting') }}</span>
        </i18next>
      </span>
      <span v-if="options.prefilter">
        <i18next path="block.recordList.preview.withPresortedRecords" tag="label">
          <code>&nbsp;{{ options.presort }}</code>
        </i18next>
      </span>
    </div>

    <div>
      <span v-if="options.hidePaging">
         <i18next path="block.recordList.preview.bePaged" tag="label">
          <span>{{ $t('block.recordList.preview.resultsCant') }}</span>
        </i18next>
      </span>
      <span v-else>
        <i18next path="block.recordList.preview.bePaged" tag="label">
          <span>{{ $t('block.recordList.preview.resultsCan') }}</span>
        </i18next>
      </span>
      <span v-if="options.perPage">
        <i18next path="block.recordList.preview.recordsPerPage" tag="label">
          <code>&nbsp;{{ options.perPage }}</code>
        </i18next>
      </span>
    </div>
  </div>
  <div v-else>{{ $t('block.recordList.preview.moduleNotSelected') }}</div>
</template>
<script>
import base from './base'

export default {
  extends: base,
  computed: {
    module () {
      return this.$store.getters['module/getByID'](this.options.moduleID)
    },

    selectedFields () {
      return this.options.fields.filter(f => !!f).map(f => f.name).join(', ')
    },
  },
}
</script>

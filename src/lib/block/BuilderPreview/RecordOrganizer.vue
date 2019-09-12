<template>
   <div>
      <i18next v-if="options.moduleID" path="block.recordOrganizer.preview.label" tag="label">
        <code>{{ getModule.name || this.options.moduleID }}</code>
        <code>{{ this.options.labelField || $t('general.label.none') }}</code>
        <code>{{ this.options.descriptionField || $t('general.label.none') }}</code>
        <code>{{ this.options.groupField || $t('general.label.none') }}</code>
        <code>{{ this.options.positionField || $t('general.label.none') }}</code>
      </i18next>
      <span v-else>
        {{ $t('block.recordOrganizer.preview.moduleNotSelected') }}
      </span>
   </div>
</template>

<script>
import base from './base'
import { mapGetters } from 'vuex'

export default {
  extends: base,

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    getModule () {
      return this.getModuleByID(this.options.moduleID)
    },
  },
}
</script>

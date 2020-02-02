<template>
    <div class="d-flex flex-wrap">
        <b-button
            variant="outline-primary"
            class="p-5 m-1 flex-fill"
            @click="$emit('select', type.block)"
            v-for="(type) in types"
            :disabled="!recordPage && type.recordPageOnly"
            :key="type.label">{{type.label}}</b-button>
      <div class="w-100">
        <hr />
        <i>{{ $t('page.build.selectBlockFootnote') }}.</i>
      </div>
    </div>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    recordPage: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      types: [
        {
          label: this.$t('block.content.label'),
          recordPageOnly: false,
          block: new compose.PageBlockContent(),
        },
        {
          label: this.$t('block.chart.label'),
          recordPageOnly: false,
          block: new compose.PageBlockChart(),
        },
        {
          label: this.$t('block.socialFeed.label'),
          recordPageOnly: false,
          block: new compose.PageBlockSocialFeed(),
        },
        {
          label: this.$t('block.record.label'),
          recordPageOnly: true,
          block: new compose.PageBlockRecord(),
        },
        {
          label: this.$t('block.recordList.label'),
          recordPageOnly: false,
          block: new compose.PageBlockRecordList(),
        },
        {
          label: this.$t('block.automation.label'),
          recordPageOnly: false,
          block: new compose.PageBlockAutomation(),
        },
        {
          label: this.$t('block.calendar.label'),
          recordPageOnly: false,
          block: new compose.PageBlockCalendar(),
        },
        {
          label: this.$t('block.file.label'),
          recordPageOnly: false,
          block: new compose.PageBlockFile(),
        },
        {
          label: this.$t('block.recordOrganizer.label'),
          recordPageOnly: false,
          block: new compose.PageBlockRecordOrganizer(),
        },
      ],
    }
  },
}
</script>

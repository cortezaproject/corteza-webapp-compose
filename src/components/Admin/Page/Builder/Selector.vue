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
import Block from 'corteza-webapp-compose/src/lib/block'

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
        { label: this.$t('block.content.label'),
          recordPageOnly: false,
          block: new Block({ kind: 'Content' }) },
        { label: this.$t('block.chart.label'),
          recordPageOnly: false,
          block: new Block({ kind: 'Chart' }) },
        { label: this.$t('block.socialFeed.label'),
          recordPageOnly: false,
          block: new Block({ kind: 'SocialFeed' }) },
        { label: this.$t('block.record.label'),
          recordPageOnly: true,
          block: new Block({ kind: 'Record' }) },
        { label: this.$t('block.recordList.label'),
          recordPageOnly: false,
          block: new Block({ kind: 'RecordList' }) },
        { label: this.$t('block.automation.label'),
          recordPageOnly: false,
          block: new Block({ kind: 'Automation' }) },
        { label: this.$t('block.calendar.label'),
          recordPageOnly: false,
          block: new Block({ kind: 'Calendar' }) },
        { label: this.$t('block.file.label'),
          recordPageOnly: false,
          block: new Block({ kind: 'File' }) },
      ],
    }
  },
}
</script>

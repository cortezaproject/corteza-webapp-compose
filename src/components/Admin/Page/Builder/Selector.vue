<template>
    <div>
        <button
            class="btn btn-outline"
            @click="$emit('select', type.block)"
            v-for="(type) in types"
            :disabled="!recordPage && type.recordPageOnly"
            :key="type.label">{{type.label}}</button>

      <hr />
      <i>{{ $t('page.build.selectBlockFootnote') }}.</i>
    </div>
</template>
<script>
import Block from '@/lib/block'

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
<style scoped lang="scss">

button {
  height: 100px;
  margin: 20px;
  width: 160px;
}

.btn-outline {
  border: 2px solid $primary;
  font-size: 14px;
  box-shadow: 0 0 3px 0 rgba($secondary, 0.75);
  background: $white;

  &:disabled {
    border-color: $secondary;
  }
}
</style>

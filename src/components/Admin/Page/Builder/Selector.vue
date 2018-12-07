<template>
    <div>
        <button
            class="btn btn-outline-primary"
            @click="$emit('select', type.block)"
            v-for="(type) in types"
            :disabled="!recordPage && type.recordPageOnly"
            :key="type.label">{{type.label}}</button>

      <hr />
      <i>Some types might be disabled for a non-record pages.</i>
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
        { label: 'Content',
          recordPageOnly: false,
          block: new Block({ kind: 'Content' }) },
        { label: 'Chart',
          recordPageOnly: false,
          block: new Block({ kind: 'Chart' }) },
        { label: 'Social media feed',
          recordPageOnly: false,
          block: new Block({ kind: 'SocialFeed' }) },
        { label: 'Record',
          recordPageOnly: true,
          block: new Block({ kind: 'Record' }) },
        { label: 'RecordList',
          recordPageOnly: false,
          block: new Block({ kind: 'RecordList' }) },
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
</style>

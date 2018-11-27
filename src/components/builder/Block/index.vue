<template>
    <div>
        <button
            @click="$emit('select', type.block)"
            v-for="(type) in types"
            :key="type.label">{{type.label}}</button>
    </div>
</template>
<script>
import Block from '@/lib/block'
import * as kinds from '@/lib/block/kinds'

export default {
  data () {
    return {
      types: [
        { label: 'Record',
          block: new Block({ options: new kinds.Record() }) },
        { label: 'RecordList',
          block: new Block({ options: new kinds.RecordList() }) },
        { label: 'Chart',
          block: new Block({ options: new kinds.Chart() }) },
        { label: 'Content',
          block: new Block({ options: new kinds.Content() }) },
        { label: 'Social media feed',
          block: new Block({ options: new kinds.SocialFeed() }) },
      ],
    }
  },
}
</script>

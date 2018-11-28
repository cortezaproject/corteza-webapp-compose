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

export default {
  data () {
    return {
      types: [
        { label: 'Record',
          block: new Block({ kind: 'Record' }) },
        { label: 'RecordList',
          block: new Block({ kind: 'RecordList' }) },
        { label: 'Chart',
          block: new Block({ kind: 'Chart' }) },
        { label: 'Content',
          block: new Block({ kind: 'Content' }) },
        { label: 'Social media feed',
          block: new Block({ kind: 'SocialFeed' }) },
      ],
    }
  },
}
</script>

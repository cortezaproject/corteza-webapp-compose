<template>
    <div>
        <button
            class="btn btn-outline"
            @click="$emit('select', type.block)"
            v-for="(type) in types"
            :disabled="!recordPage && type.recordPageOnly"
            :key="type.label">{{type.label}}</button>

      <hr />
      <i>Some types might be disabled for non-record pages.</i>
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
        { label: 'Automation',
          recordPageOnly: false,
          block: new Block({ kind: 'Automation' }) },
      ],
    }
  },
}
</script>
<style scoped lang="scss">
@import "@/assets/sass/_0.declare.scss";

button {
  height: 100px;
  margin: 20px;
  width: 160px;
}

.btn-outline {
  border: 2px solid $appblue;
  font-size: 14px;
  box-shadow: 0 0 3px 0 rgba($appgrey, 0.75);
  background: $white;

  &:disabled {
    border-color: $appgrey;
  }
}
</style>

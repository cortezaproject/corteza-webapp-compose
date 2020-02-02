<template>
  <record-list
    v-bind="$props"
  />
</template>
<script>
import base from './base'
import RecordList from '../View/RecordList'

export default {
  components: {
    RecordList,
  },

  extends: base,
}
</script>

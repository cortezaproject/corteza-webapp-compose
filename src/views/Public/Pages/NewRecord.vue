<template>
  <div class="view">
    <div>
      <button class="btn btn-outline" @click="handleSave">Save (todo)</button>
      <button class="btn btn-outline" @click.prevent="$router.push({ name: 'public.page.record.new' })">New</button>
      <button class="btn btn-outline" @click.prevent="$router.back()">Back</button>
    </div>
    <grid :page="page" :record="record" edit-mode />
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'
import View from './View'

export default {
  name: 'NewRecord',
  extends: View,

  data () {
    return {
      record: { fields: [] },
    }
  },

  methods: {
    handleSave () {
      console.log(this.record)
      alert('Pending implementation')
    },
  },

  components: {
    Grid,
  },
}
</script>

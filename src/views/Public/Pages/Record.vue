<template>
  <div class="view">
    <div>
      <button class="btn btn-outline" @click.prevent="$router.push({ name: 'public.page.record.edit' })">Edit</button>
      <button class="btn btn-outline" @click.prevent="$router.push({ name: 'public.page.record.new' })">New</button>
      <button class="btn btn-outline" @click.prevent="handleDelete">Delete (@todo)</button>
      <button class="btn btn-outline" @click.prevent="$router.back()">Back</button>
    </div>
    <grid :page="page" :record="record" />
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'
import View from './View'

export default {
  name: 'Record',
  extends: View,
  props: {
    recordID: {
      type: String,
      required: false,
    },
  },

  data () {
    return {
      record: {},
    }
  },

  watch: {
    recordID () {
      this.loadRecord()
    },
  },

  mounted () {
    this.loadRecord()
  },

  methods: {
    loadRecord () {
      this.record = null
      if (this.page && this.recordID && this.page.moduleID) {
        this.$crm.moduleContentRead({ moduleID: this.page.moduleID, contentID: this.recordID }).then(record => {
          this.record = record
        })
      }
    },

    handleDelete () {
      console.log(this.record)
      alert('Pending implementation')
    },
  },

  components: {
    Grid,
  },
}
</script>

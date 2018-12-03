<template>
  <div class="view">
    <div>
      <button class="btn btn-outline" @click="handleCreate">Save (todo)</button>
      <button class="btn btn-outline" @click.prevent="$router.push({ name: 'public.page.record.create' })">New</button>
      <button class="btn btn-outline" @click.prevent="$router.back()">Back</button>
    </div>
    <grid :page="page" :record="record" edit-mode />
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'

export default {
  name: 'CreateRecord',

  props: {
    // Receives page object via router-view component
    page: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      record: { fields: [] },
    }
  },

  methods: {
    handleCreate () {
      console.log(this.record)
      alert('Pending implementation')
    },
  },

  components: {
    Grid,
  },
}
</script>

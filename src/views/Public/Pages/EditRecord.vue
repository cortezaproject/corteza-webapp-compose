<template>
  <div class="view">
    <div>
      <router-link :to="{ name: 'public.page.record.edit' }">Edit (placeholder)</router-link>
      <router-link :to="{ name: 'public.page.record.new' }">New (placeholder)</router-link>
      <button>Delete (placeholder)</button>
      <button @click.prevent="$router.back()">Back</button>
    </div>
    <grid :pageID="pageID" :recordID="recordID" edit-mode />
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'

export default {
  props: {
    pageID: {
      type: String,
      required: true,
    },

    recordID: {
      type: String,
      required: false,
    },
  },

  components: {
    Grid,
  },
}
</script>

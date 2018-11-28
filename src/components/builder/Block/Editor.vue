<template>
  <form class="col-12">
    <fieldset class="form-group">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          v-model="block.title"
          type="text"
          class="form-control form-control-sm"
          id="title"
          placeholder="Block Title"
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <input
          v-model="block.description"
          type="text"
          class="form-control form-control-sm"
          id="description"
          placeholder="Block Description"
        >
      </div>
    </fieldset>
    <component :is="block.kind" :options.sync="block.options"/>

    <hr>
    {{ block }}
  </form>
</template>

<script>
import * as BlockComponents from '@/components/builder/Block/Kind'

export default {
  props: {
    block: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      t: 'Content',
    }
  },

  components: {
    ...BlockComponents,
  },
}
</script>
<style lang="scss" scoped>

</style>

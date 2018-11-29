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
    <block-kind-edit :kind="block.kind" :options.sync="block.options"/>
  </form>
</template>

<script>
import BlockKindEdit from '@/lib/block/Edit'

export default {
  props: {
    block: {
      type: Object,
      required: true,
    },
  },

  components: {
    BlockKindEdit,
  },
}
</script>
<style lang="scss" scoped>
</style>

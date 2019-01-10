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
     <div class="form-group">
       <label for="color">Header style</label>
       <b-form-select v-model="block.theme" :options="options" class="mb-3" />
       <div :class="'theme-'+block.theme">
         <h2>Preview of your header</h2>
       </div>
     </div>
    </fieldset>
    <component :is="block.kind" :module="module" :page="page" :options.sync="block.options"/>
  </form>
</template>

<script>
import * as EditBlocks from './loader'

export default {
  props: {
    block: {
      type: Object,
      required: true,
    },

    page: {
      type: Object,
      required: true,
    },

    module: {
      type: Object,
      required: false,
    },
  },

  data () {
    return {
      options: [
        { value: '', text: 'White with dark text - default' },
        { value: 'red-light', text: 'Red with white text' },
        { value: 'red-dark', text: 'Red with dark text' },
        { value: 'green-light', text: 'Green with white text' },
        { value: 'green-dark', text: 'Green with dark text' },
        { value: 'blue-light', text: 'Blue with white text' },
        { value: 'blue-dark', text: 'Blue with dark text' },
        { value: 'grey-light', text: 'Grey with white text' },
        { value: 'grey-dark', text: 'Grey with dark text' },
        { value: 'yellow-dark', text: 'Yellow with dark text' },
      ],
    }
  },

  components: {
    ...EditBlocks,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/blocks.scss";

h2 {
  font-size: 15px;
  padding: 5px 10px;
}
</style>

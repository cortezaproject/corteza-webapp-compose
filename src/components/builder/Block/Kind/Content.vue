<template>
    <div>
        <fieldset class="form-group">
            @todo A text block that allows HTML. Best would be a TinyMCE or similar.
            <textarea rows="5" v-model="o.body"></textarea>
        </fieldset>
    </div>
</template>
<script>
import { Content } from '@/lib/block/Content'

export default {
  props: {
    options: {
      type: Object,
      default () { return new Content() },
    },
  },

  computed: {
    o: {
      get () {
        return this.options
      },

      set (o) {
        this.$emit('update:options', o)
      },
    },
  },
}
</script>

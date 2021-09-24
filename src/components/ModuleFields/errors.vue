<template>
  <div>
    <b-form-invalid-feedback
      v-for="(error, i) in set"
      :key="i"
      force-show
    >
      {{ error.message }}
    </b-form-invalid-feedback>
  </div>
</template>
<script>
import { validator } from '@cortezaproject/corteza-js'

export default {
  props: {
    errors: {
      type: validator.Validated,
      required: true,
      default: () => ({}),
    },

    index: {
      type: Number,
      required: false,
      default: -1,
    },
  },

  computed: {
    set () {
      if (this.index >= 0) {
        return this.errors
          .filterByMeta('index', this.index)
          .get()
      } else {
        return this.errors
          .get()
      }
    },
  },
}
</script>

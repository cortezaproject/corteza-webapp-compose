<template>
  <div>
    <b-form-invalid-feedback
      force-show
      v-for="(error, i) in set"
      :key="i"
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
    },

    index: {
      type: Number,
      required: false,
    },
  },

  computed: {
    set () {
      if (this.index === undefined) {
        return this.errors
          .get()
      } else {
        return this.errors
          .filterByMeta('index', this.index)
          .get()
      }
    },
  },
}
</script>

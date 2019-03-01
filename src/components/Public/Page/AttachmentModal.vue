<template>
  <b-modal id="modal-center" v-model="show" centered hide-footer>
    <b-button @click="ptr--" :disabled="ptr === 0">prev</b-button>
    <img :src="current.url" v-if="current" />
    <b-button @click="ptr++" :disabled="set.length === ptr + 1">next</b-button>
  </b-modal>
</template>
<script>

export default {
  computed: {
    show: {
      get () {
        return this.set !== undefined
      },

      set (show) {
        if (!show) {
          this.set = undefined
        }
      },
    },

    current () {
      if (this.show && this.set[this.ptr] !== undefined) {
        return this.set[this.ptr]
      }
    },
  },

  data () {
    return {
      ptr: 0,
      set: undefined,
    }
  },

  created () {
    this.$root.$on('showAttachmentsModal', (ptr, set) => {
      this.ptr = ptr
      this.set = set
    })
  },
}
</script>

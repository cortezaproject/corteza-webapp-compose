<template>
  <b-modal size="lg" v-model="show" centered hide-footer>
    <div v-if="current">
      <!--<b-button @click="ptr&#45;&#45;" :disabled="ptr === 0">prevtest</b-button>-->
      <img :src="current.url" />
      <!--<b-button @click="ptr++" :disabled="set.length === ptr + 1">next</b-button>-->
    </div>
  </b-modal>
</template>
<script>

export default {
  data () {
    return {
      ptr: 0,
      set: undefined,
    }
  },

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

  created () {
    this.$root.$on('showAttachmentsModal', (ptr, set) => {
      this.ptr = ptr
      this.set = set
    })
  },
}
</script>
<style lang="scss" scoped>
  img {
    max-width: 100%;
  }

</style>

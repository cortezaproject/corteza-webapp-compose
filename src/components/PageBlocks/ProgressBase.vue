<template>
  <wrap
    class="p-2"
    v-bind="$props"
    v-on="$listeners"
  >
    <div
      v-if="processing"
      class="d-flex align-items-center justify-content-center h-100"
    >
      <b-spinner />
    </div>

    <b-progress
      v-else
      :max="50"
      class="w-100 h-100 bg-light"
    >
      <b-progress-bar
        :value="15"
        :striped="options.display.striped"
        :animated="options.display.animated"
        :variant="progressVariant"
      >
        {{ progressLabel }}
      </b-progress-bar>
    </b-progress>
  </wrap>
</template>

<script>
import base from './base'

export default {
  extends: base,

  props: {
  },

  data () {
    return {
      processing: false,

      preview: {
        value: 15,
        max: 50,
      },
    }
  },

  computed: {
    progressLabel () {
      let { value, max } = this.preview
      const { showValue, showRelative, showProgress } = this.options.display || {}

      if (!showValue) {
        return
      }

      if (showRelative) {
        // https://stackoverflow.com/a/21907972/17926309
        value = `${Math.round(((value / max) * 100) * 100) / 100}%`
      }

      if (showProgress) {
        value = `${value} / ${showRelative ? '100' : max}${showRelative ? '%' : ''}`
      }

      return value
    },

    progressVariant () {
      const { value } = this.preview
      const { variant } = this.options.display || {}
      let progressVariant = variant

      if (this.options.display.thresholds.length) {
        const sortedVariants = [...this.options.display.thresholds].filter(t => t.value).sort((a, b) => b.value - a.value)
        const { variant } = sortedVariants.find(t => value > t.value) || {}
        progressVariant = variant || progressVariant
      }

      return progressVariant
    },
  },

  mounted () {
    this.$root.$on(`refetch-non-record-blocks:${this.page.pageID}`, this.update)
  },

  beforeDestroy () {
    this.$root.$off(`refetch-non-record-blocks:${this.page.pageID}`)
  },
}
</script>

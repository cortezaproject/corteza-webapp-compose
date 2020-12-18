<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div
      v-for="(m, i) in options.metrics"
      :key="i"
    >
      <div
        v-for="(v, i) in formatResponse(m, i)"
        :key="i"
      >
        <!-- <h3 :style="genStyle(m.labelStyle)">
          {{ v.label }}
        </h3> -->
        <h3
          class="p-2"
          :style="genStyle(m.valueStyle)"
        >
          <span v-if="m.prefix">
            {{ m.prefix }}
          </span>
          {{ v.value }}
          <span v-if="m.suffix">
            {{ m.suffix }}
          </span>
        </h3>
      </div>
    </div>
  </wrap>
</template>

<script>
import base from './base'
import numeral from 'numeral'
import moment from 'moment'

export default {
  extends: base,

  props: {
    // Preview mode automatically generates data instead of fetching from the API
    previewMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data () {
    return {
      reports: [],
    }
  },

  mounted () {
    this.update()

    this.$root.$on('metric.update', this.update)
  },

  beforeDestroy () {
    this.$root.$off('metric.update', this.update)
  },

  methods: {
    /**
     * Generates style for the given metric as defined in configurator
     */
    genStyle (s = {}) {
      const d = {
        color: s.color,
        backgroundColor: s.backgroundColor,
        fontSize: s.fontSize ? s.fontSize + 'px' : undefined,
      }

      for (const v of Object.keys(d)) {
        if (d[v] === undefined) {
          delete d[v]
        }
      }
      return d
    },

    /**
     * Performs some post processing on the provided data
     */
    formatResponse (m, i) {
      const vals = this.reports[i]
      if (!vals) {
        return []
      }

      return vals.map(({ label, value }) => {
        if (m.numberFormat) {
          value = numeral(value).format(m.numberFormat)
        }

        if (m.dateFormat) {
          label = moment(label).format(m.dateFormat)
        }

        return {
          label,
          value,
        }
      })
    },

    /**
     * Pulls fresh data from the API
     */
    async update () {
      const rtr = []
      const namespaceID = this.namespace.namespaceID
      const reporter = r => this.$ComposeAPI.recordReport({ ...r, namespaceID })

      for (const m of this.options.metrics) {
        if (m.moduleID) {
          const vals = await this.block.fetch({ m }, reporter)
          rtr.push(vals)
        }
      }

      this.reports = rtr
    },
  },
}
</script>

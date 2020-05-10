<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div
      v-for="(m, i) in options.metrics"
      :key="i"
    >
      <h4
        class="p-2"
        :style="genStyle(m.labelStyle)"
      >
        {{ m.label }}
      </h4>
      <p
        class="p-2"
        :style="genStyle(m.valueStyle)"
      >
        <span
          v-for="(v, i) in formatResponse(m, i)"
          :key="i"
        >
          <b>
            {{ v.label }}
          </b>
          <br />
          {{ v.value }}
        </span>
      </p>
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
      if (this.previewMode) {
        return [{
          label: this.$t('block.metric.edit.previewMetricLabel'),
          value: Math.floor(Math.random() * 1000) * 1000,
        }]
      }

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
        const vals = await this.block.fetch({ m }, reporter)
        rtr.push(vals)
      }

      this.reports = rtr
    },
  },
}
</script>

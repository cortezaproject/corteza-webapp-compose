<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div
      v-for="(m, i) in options.metrics"
      :key="i"
      class="h-100 d-flex align-items-center justify-content-center overflow-hidden"
    >
      <div
        v-for="(v, i) in formatResponse(m, i)"
        :key="i"
        class="w-100 h-100 px-2 py-1"
      >
        <!-- <h3 :style="genStyle(m.labelStyle)">
          {{ v.label }}
        </h3> -->
        <metric-item :metric="m" :value="v" />
      </div>
    </div>
  </wrap>
</template>

<script>
import base from './base'
import numeral from 'numeral'
import moment from 'moment'
import MetricItem from './Metric/Item'
import { NoID } from '@cortezaproject/corteza-js'
import { evaluatePrefilter } from 'corteza-webapp-compose/src/lib/record-filter'

export default {
  components: {
    MetricItem,
  },

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
          // prepare a fresh metric with an evaluated prefilter
          const auxM = { ...m }
          if (auxM.filter) {
            auxM.filter = evaluatePrefilter(auxM.filter, {
              record: this.record,
              recordID: (this.record || {}).recordID || NoID,
              ownerID: (this.record || {}).userID || NoID,
              userID: (this.$auth.user || {}).userID || NoID,
            })
          }

          const vals = await this.block.fetch({ m: auxM }, reporter)
          rtr.push(vals)
        }
      }

      this.reports = rtr
    },
  },
}
</script>
<style scoped lang="scss">
h3 {
  line-height: 1;
}
</style>

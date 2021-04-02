<template>
  <div :style="genStyle(metric.valueStyle)"
       class="h-100 text-center"
  >
    <svg
      :viewBox="getVB"
      class="h-100 w-100 align-items-end d-flex"
      width="100%"
      height="100%"
    >
      <text
        ref="metricItem"
        y="50%"
        x="50%"
        text-anchor="middle"
        dominant-baseline="central"
        text-rendering="geometricPrecision"
      >
          <template v-if="metric.prefix">{{ metric.prefix }}</template>
          {{ value.value }}
          <template v-if="metric.suffix">{{ metric.suffix }}</template>
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    metric: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },

  data () {
    return {
      vvb: ['0', '0', '0', '0'],
    }
  },

  computed: {
    getVB () {
      return this.vvb.join(' ')
    },
  },

  watch: {
    metric: {
      handler: function () {
        this.update()
      },
      immediate: true,
    },
    value: {
      handler: function () {
        this.update()
      },
      immediate: true,
    },
  },

  methods: {
    update () {
      this.$nextTick(function () {
        const { width, height } = this.$refs.metricItem.getBBox()
        const tmp = [...this.vvb]
        tmp[2] = parseInt(Math.ceil(width))
        tmp[3] = parseInt(Math.ceil(height))
        this.vvb = tmp
      })
    },

    genStyle (s = {}) {
      const d = {
        fill: s.color,
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
  },
}
</script>

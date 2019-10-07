<template>
  <b-card header-bg-variant="white"
          footer-bg-variant="white">

    <b-form-group>
      <b-progress :max="progress.entryCount"
                  show-value
                  show-progress
                  variant="primary"
                  height="80px">

        <b-progress-bar :value="progress.completed">
          {{ $t('block.recordList.import.progress', progress) }}
        </b-progress-bar>
      </b-progress>
    </b-form-group>

    <div slot="footer">
      <span v-if="progress.finishedAt && !progress.failed"
            class="text-success">

        {{ $t('block.recordList.import.success') }}
      </span>
    </div>
  </b-card>
</template>

<script>
let toHandle = null

export default {
  props: {
    session: {
      type: Object,
      required: true,
      default: () => ({}),
    },

    noPool: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      progress: this.session.progress || {},
    }
  },

  watch: {
    progress: {
      handler: function ({ finishedAt, failed }) {
        if (finishedAt && failed) {
          this.clearTimeout()
          this.$emit('importFailed', this.progress)
        } else if (finishedAt) {
          this.clearTimeout()
          this.$root.$emit('recordList.refresh', this.session)
        }
      },
      deep: true,
      immediate: true,
    },
  },

  mounted () {
    if (!this.noPool) {
      this.pool()
    }
  },

  beforeDestroy () {
    this.clearTimeout()
  },

  methods: {
    clearTimeout () {
      if (toHandle !== null) {
        window.clearTimeout(toHandle)
        toHandle = null
      }
    },

    pool () {
      this.$ComposeAPI.recordImportProgress(this.session)
        .then(({ progress }) => {
          this.progress = progress
          toHandle = window.setTimeout(this.pool, 2000)
        })
    },
  },
}
</script>

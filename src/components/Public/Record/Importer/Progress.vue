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
  },

  data () {
    return {
      progress: this.session.progress,
    }
  },

  watch: {
    progress ({ finishedAt, failed }) {
      if (finishedAt && failed) {
        window.clearTimeout(toHandle)
        this.$emit('importFailed', this.progress)
      } else if (finishedAt) {
        window.clearTimeout(toHandle)
      }
    },
  },

  mounted () {
    this.pool()
  },

  beforeDestroy () {
    window.clearTimeout(toHandle)
  },

  methods: {
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

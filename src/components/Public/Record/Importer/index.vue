<template>
  <div>
    <b-button @click="showModal=true"
              size="sm"
              variant="outline-primary">

      {{ $t('general.label.import') }}
    </b-button>

    <b-modal :visible="showModal"
             @hide="onModalHide"
             size="lg"
             :title="$t('block.recordList.import.to', { modulename: module.name })"
             hide-footer
             body-class="p-0">

      <component :is="stepComponent"
                 v-bind="$props"
                 :session="session"
                 @fileUploaded="onFileUploaded"
                 @fieldsMatched="onFieldsMatched"
                 @importFailed="onImportFailed"
                 v-on="$listeners">

        <label v-if="progress.failed"
               class="text-danger"
               slot="uploadLabel">

          {{ $t('block.recordList.import.failed', progress) }}
        </label>
      </component>
    </b-modal>
  </div>
</template>

<script>
import FileUpload from './FileUpload'
import FieldMatch from './FieldMatch'
import Progress from './Progress'

export default {
  name: 'Importer',
  props: {
    namespace: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    module: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data () {
    return {
      step: 0,
      showModal: false,
      session: {},
      components: [FileUpload, FieldMatch, Progress],
    }
  },

  computed: {
    stepComponent () {
      return this.components[this.step]
    },

    progress () {
      return this.session.progress || {}
    },
  },

  methods: {
    onModalHide () {
      this.step = 0
      this.session = {}
      this.showModal = false
    },

    onFileUploaded (e) {
      this.session = e
      this.step = 1
    },

    onFieldsMatched (e) {
      this.session.fields = e
      this.step = 2

      this.$ComposeAPI.recordImportRun(this.session)
    },

    onImportFailed (e) {
      this.session.progress = e
      this.step = 0
    },
  },
}
</script>

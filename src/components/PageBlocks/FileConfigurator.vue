<template>
  <b-tab :title="$t('kind.file.label')">
    <b-form-group
      horizontal
      :description="$t('kind.file.view.modeFootnote')"
      :label="$t('kind.file.view.modeLabel')"
    >
      <b-form-radio-group
        v-model="options.mode"
        buttons
        button-variant="outline-secondary"
        size="sm"
        name="buttons2"
        :options="modes"
      />
    </b-form-group>
    <b-form-checkbox
      v-model="options.hideFileName"
      :disabled="!enableFileNameHiding"
      class="mb-3"
    >
      {{ $t('kind.file.view.showName') }}
    </b-form-checkbox>
    <uploader
      :endpoint="endpoint"
      :max-filesize="$s('compose.Page.Attachments.MaxSize', 100)"
      :accepted-files="$s('compose.Page.Attachments.Mimetypes', ['*/*'])"
      @uploaded="appendAttachment"
    />
    <list-loader
      kind="page"
      enable-delete
      :namespace="namespace"
      :set.sync="options.attachments"
      mode="list"
      class="mt-2"
    />

    <hr>

    <h5 class="mb-2">
      {{ $t('kind.file.view.style') }}
    </h5>

    <b-row
      cols="12"
      class="mb-2 mt-2"
    >
      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.height') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.height"
              type="number"
              :placeholder="$t('kind.file.view.height')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.width') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.width"
              type="number"
              :placeholder="$t('kind.file.view.width')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.maxHeight') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.maxHeight"
              type="number"
              :placeholder="$t('kind.file.view.maxHeight')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.maxWidth') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.maxWidth"
              type="number"
              :placeholder="$t('kind.file.view.maxWidth')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.borderRadius') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.borderRadius"
              type="number"
              :placeholder="$t('kind.file.view.borderRadius')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group
          :label="$t('kind.file.view.background')"
        >
          <b-form-input
            v-model="options.backgroundColor"
            type="color"
            debounce="300"
            class="mb-1"
          />
        </b-form-group>
      </b-col>

      <b-col
        cols="6"
        align-self="center"
      >
        <b-form-group>
          <label>{{ $t('kind.file.view.margin') }}</label>
          <b-input-group
            :append="$t('kind.file.view.px')"
          >
            <b-form-input
              v-model="options.margin"
              type="number"
              :placeholder="$t('kind.file.view.margin')"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </b-tab>
</template>
<script>
import base from './base'
import Uploader from 'corteza-webapp-compose/src/components/Public/Page/Attachment/Uploader'
import ListLoader from 'corteza-webapp-compose/src/components/Public/Page/Attachment/ListLoader'

export default {
  i18nOptions: {
    namespaces: 'field',
  },

  name: 'File',

  components: {
    Uploader,
    ListLoader,
  },

  extends: base,

  computed: {
    endpoint () {
      const { pageID } = this.page

      return this.$ComposeAPI.pageUploadEndpoint({
        namespaceID: this.namespace.namespaceID,
        pageID,
      })
    },

    modes () {
      return [
        { value: 'list', text: this.$t('kind.file.view.list') },
        { value: 'grid', text: this.$t('kind.file.view.grid') },
        { value: 'single', text: this.$t('kind.file.view.single') },
        { value: 'gallery', text: this.$t('kind.file.view.gallery') },
      ]
    },

    enableFileNameHiding () {
      return (this.options.mode === 'single') || (this.options.mode === 'gallery')
    },
  },

  methods: {
    appendAttachment ({ attachmentID } = {}) {
      this.options.attachments.push(attachmentID)
    },
  },
}
</script>

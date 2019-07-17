<template>
  <div>
    <div v-if="mode === 'list'" class="list">
      <draggable :list.sync="attachments" :disabled="!enableOrder">
        <div v-for="(a, index) in attachments" :key="a.attachmentID" v-if="a" class="item">
          <div class="row no-gutters">
            <div v-if="enableOrder" class="col-sm-1 my-auto text-center">
              <font-awesome-icon v-b-tooltip.hover
                              :icon="['fas', 'sort']"
                              :title="$t('general.tooltip.dragAndDrop')"
                              class="handle text-secondary" />
            </div>
            <div :class="{'col-sm-9': enableOrder, 'col-sm-10': !enableOrder}">
              <attachment-link :attachment="a" />
              <i18next path="general.label.attachmentFileInfo" tag="label">
                <span>{{ size(a) }}</span>
                <span>{{ uploadedAt(a) }}</span>
              </i18next>
            </div>
            <div class="col-sm-2 text-right my-auto">
              <a :href="a.download"><font-awesome-icon :icon="['fas', 'download']"></font-awesome-icon></a>
              <b-button variant="link"
                        class="delete right inline"
                        v-if="enableDelete"
                        @click="deleteAttachment(index)">
                <font-awesome-icon :icon="['far', 'trash-alt']" class="action"></font-awesome-icon>
              </b-button>
            </div>
          </div>
        </div>
      </draggable>
    </div>

    <div v-else-if="mode === 'grid'" class="grid">
      <div v-for="a in attachments" :key="a.attachmentID" v-if="a" class="p-2">
        <attachment-link :attachment="a" class="d-block">
          <font-awesome-icon :icon="['far', 'file-'+ext(a)]" class="text-dark float-left mr-2"></font-awesome-icon>
          {{a.name}}
        </attachment-link>
        <i18next path="general.label.attachmentFileInfo" tag="label">
          <span>{{ size(a) }}</span>
          <span>{{ uploadedAt(a) }}</span>
        </i18next>
      </div>
    </div>

    <div v-else-if="mode === 'single' || 'gallery'" class="single gallery">
      <div v-for="(a) in attachments" :key="a.attachmentID" v-if="a" class="mb-2">
        <preview-inline
          v-if="canPreview(a)"
          @openPreview="openLightbox({ ...a, ...$event })"
          :src="inlineUrl(a)"
          :meta="a.meta"
          :name="a.name"
          :alt="a.name"
          :preview-style="{ width: 'unset' }"
          :labels="previewLabels" />

        <div v-else>
          <font-awesome-icon
            :icon="['far', 'file-'+ext(a)]"
            title="Open bookmarks"
          ></font-awesome-icon>
        </div>
        <attachment-link :attachment="a" />
      </div>
    </div>
  </div>
</template>
<script>
import numeral from 'numeral'
import moment from 'moment'
import Attachment from 'corteza-webapp-compose/src/lib/attachment'
import Namespace from 'corteza-webapp-compose/src/lib/namespace'
import { PreviewInline, canPreview } from 'corteza-webapp-common/src/components/FilePreview/'
import AttachmentLink from './Link'
import draggable from 'vuedraggable'

export default {
  components: {
    PreviewInline,
    AttachmentLink,
    draggable,
  },

  props: {
    enableDelete: {
      type: Boolean,
    },

    enableOrder: {
      type: Boolean,
      default: false,
    },

    namespace: {
      type: Namespace,
      required: true,
    },

    kind: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      required: true,
    },

    set: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      attachments: [],
    }
  },

  computed: {
    inlineUrl () {
      return (a) => this.ext(a) === 'pdf' ? a.download : a.previewUrl
    },

    previewLabels () {
      return {
        loading: this.$t('preview.pdf.loading'),
        firstPagePreview: this.$t('preview.pdf.firstPagePreview'),
        pageLoadFailed: this.$t('preview.pdf.pageLoadFailed'),
        pageLoading: this.$t('preview.pdf.pageLoading'),
      }
    },

    canPreview () {
      return (a) => {
        const meta = a.meta || {}
        const type = (meta.preview || meta.original || {}).mimetype
        const src = this.inlineUrl(a)
        return canPreview({ type, src, name: a.name })
      }
    },
  },

  watch: {
    set: {
      immediate: true,
      handler (set) {
        this.attachments = set.map(a => {
          if (typeof a === 'object') {
            return new Attachment(a)
          } else {
            return null
          }
        })

        const namespaceID = this.namespace.namespaceID
        set.forEach((attachmentID, index) => {
          if (typeof attachmentID === 'string') {
            this.$ComposeAPI.attachmentRead({ kind: this.kind, attachmentID, namespaceID }).then(att => {
              this.attachments.splice(index, 1, new Attachment(att))
            })
          }
        })
      },
    },
  },

  methods: {
    size (a) {
      return numeral(a.meta.original.size).format('0b')
    },

    uploadedAt (a) {
      return moment(a.updatedAt || a.createdAt).fromNow()
    },

    openLightbox (e) {
      this.$root.$emit('showAttachmentsModal', e)
    },

    deleteAttachment (index) {
      this.attachments.splice(index, 1)
      this.$emit('update:set', this.attachments.map(a => a.attachmentID))
    },

    ext (a) {
      const { meta } = a
      switch (meta && meta.original ? meta.original.ext : null) {
        case 'odt':
        case 'doc':
        case 'docx':
          return 'word'
        case 'pdf':
          return 'pdf'
        case 'ppt':
        case 'pptx':
          return 'powerpoint'
        case 'zip':
        case 'rar':
          return 'archive'
        case 'xls':
        case 'xlsx':
        case 'csv':
          return 'excel'
        case 'mov':
        case 'mp3':
        case 'mp4':
          return 'video'
        case 'png':
        case 'jpg':
        case 'jpeg':
          return 'image'
        default: return 'alt'
      }
    },
  },
}
</script>
<style lang="scss" scoped>

.grid {
  .svg-inline--fa {
    font-size: 40px;
  }
}

.single {
  .svg-inline--fa {
    font-size: 40px;
  }

  img {
    cursor: pointer;
  }
}

.handle {
  cursor: grab;
}
</style>

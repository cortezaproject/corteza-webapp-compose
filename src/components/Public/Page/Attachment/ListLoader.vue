<template>
  <div>
    <div v-if="mode === 'list'" class="list">
      <div v-for="(a, index) in attachments" :key="a.attachmentID" v-if="a" class="item">
        <div class="row">
          <div class="col-sm-10">
            <attachment-link :attachment="a" />
            <i18next path="general.label.attachmentFileInfo" tag="label">
              <span>{{ size(a) }}</span>
              <span>{{ uploadedAt(a) }}</span>
            </i18next>
          </div>
          <div class="col-sm-2 text-right">
            <a :href="a.download"><font-awesome-icon :icon="['fas', 'download']"></font-awesome-icon></a>
            <b-button variant="link"
                      class="delete right inline"
                      v-if="enableDelete"
                      @click="deleteAttachment(index)"><i class="action icon-trash"></i></b-button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="mode === 'grid'" class="grid">
      <div v-for="a in attachments" :key="a.attachmentID" v-if="a" class="item">
        <attachment-link :attachment="a">
          <font-awesome-icon :icon="['far', 'file-'+ext(a)]"></font-awesome-icon>
          {{a.name}}
        </attachment-link>
        <i18next path="general.label.attachmentFileInfo" tag="label">
          <span>{{ size(a) }}</span>
          <span>{{ uploadedAt(a) }}</span>
        </i18next>
      </div>
    </div>

    <div v-else-if="mode === 'single' || 'gallery'" class="single gallery">
      <div v-for="(a) in attachments" :key="a.attachmentID" v-if="a" class="item mb-2">
        <preview-inline
          v-if="canPreview(a)"
          @openPreview="openLightbox({ ...a, ...$event })"
          :src="inlineUrl(a)"
          :meta="(a.meta.preview || {}).image || {}"
          :name="a.name"
          :alt="a.name"
          :preview-style="{ width: 'unset' }" />

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
import Attachment from '@/lib/attachment'
import Namespace from '@/lib/namespace'
import { canPreview } from 'corteza-webapp-common/src/lib/file_preview'
import { PreviewInline } from 'corteza-webapp-common/src/components/FilePreview/index'
import AttachmentLink from './Link'

export default {
  components: {
    PreviewInline,
    AttachmentLink,
  },

  props: {
    enableDelete: {
      type: Boolean,
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
      return moment(a.updatedAt || a.createdAt).locale('en').fromNow()
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

.fa-download {
  color: $black;
  font-size: 12px;
  margin-right: 2px;
  vertical-align: baseline;
}

.list {
  .item {
    min-height: 30px;
  }
}

.grid {
  .item {
    padding: 10px 0;

    a {
      display: block;
      line-height: 13px;
    }

    .svg-inline--fa {
      color: #000;
      font-size: 30px;
      float: left;
      margin-right: 10px;
    }
  }
}

.single {
  .item {
    .svg-inline--fa {
      font-size: 40px;
    }

    img {
      cursor: pointer;
    }
  }
}
</style>

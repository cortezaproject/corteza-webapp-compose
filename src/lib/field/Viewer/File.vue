<template>
  <div>
    <div v-if="field.options.mode === 'list'">
      <div v-for="a in attachments" :key="a.attachmentID">
        <a :href="a.download">
          <font-awesome-icon :icon="['fas', 'download']"></font-awesome-icon>
          {{a.name}}
        </a>
        (File size: {{a.size}}, uploaded {{a.changedAt}})
      </div>
    </div>

    <div v-if="field.options.mode === 'grid'">
      <div v-for="a in attachments" :key="a.attachmentID" class="grid">
        <a :href="a.download">
          <font-awesome-icon
            :icon="['far', 'file-'+ext(a)]"
            title="Open bookmarks"
          ></font-awesome-icon>
          {{a.name}}
        </a>
        (File size: {{a.size}}, uploaded {{a.changedAt}})
      </div>
    </div>

    <div v-if="field.options.mode === 'single' || 'gallery'" class="single">
      <div v-for="(a, index) in attachments" :key="a.attachmentID">
        <div v-if="isImage(a)">
          <img :src="a.previewUrl" @click="openLightbox(index)" />
        </div>
        <div v-else>
          <font-awesome-icon
            :icon="['far', 'file-'+ext(a)]"
            title="Open bookmarks"
          ></font-awesome-icon>
          <a :href="a.download">
            Download
          </a>
        </div>
        {{a.name}}
      </div>
    </div>
  </div>
</template>
<script>
import base from './base'
import numeral from 'numeral'
import moment from 'moment'

export default {
  extends: base,

  data () {
    return {
      attachments: [],
    }
  },

  computed: {
    baseUrl () {
      return window.CrustConfig.crm.baseUrl
    },
  },

  created () {
    const { recordID, moduleID } = this.record

    this.$crm.attachmentList({ kind: 'record', recordID, moduleID, fieldName: this.field.name }).then(({ attachments }) => {
      this.attachments = attachments.map(a => {
        a.previewUrl = this.baseUrl + a.previewUrl
        a.url = this.baseUrl + a.url
        a.download = a.url + '?download=1'
        a.size = numeral(a.meta.original.size).format('0b')
        a.changedAt = moment(a.updatedAt || a.createdAt).fromNow()
        return a
      })
    })
  },

  methods: {
    openLightbox (index) {
      this.$root.$emit('showAttachmentsModal', index, this.attachments)
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
    isImage (a) {
      return /^image\//.test(a.meta.original.mimetype)
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";

.fa-download {
  color: $black;
  font-size: 12px;
  margin-right: 2px;
  vertical-align: baseline;
}

.grid {
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

img {
  cursor: pointer;
}

.single {
  .svg-inline--fa {
    font-size: 40px;
  }
}
</style>

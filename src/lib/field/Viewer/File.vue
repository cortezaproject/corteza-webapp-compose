<template>
  <div>
    <div v-for="(a, index) in attachments" :key="a.attachmentID">
      <img :src="a.previewUrl" @click="openLightbox(index)" />
    </div>

    <div v-if="field.options.mode === 'list'">
      <div v-for="a in attachments" :key="a.attachmentID">
        <a :href="a.download">
          <font-awesome-icon :icon="['fas', 'download']"></font-awesome-icon>
          {{a.name}}
        </a> (File size: {{a.size}}, changed: {{a.changedAt}}
      </div>
    </div>

    <div v-if="field.options.mode === 'grid'">
      @todo icons
      {{ attachments }}
    </div>

    <div v-if="field.options.mode === 'single'">
      @todo single
      {{ attachments }}
    </div>

    <div v-if="field.options.mode === 'gallery'">
      @todo gallery
      {{ attachments }}
    </div>
    {{ value }}
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
</style>

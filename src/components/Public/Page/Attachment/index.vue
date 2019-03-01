<template>
  <div>
    <div v-if="mode === 'list'">
        <a :href="attachment.download">
          <font-awesome-icon :icon="['fas', 'download']"></font-awesome-icon>
          {{aattachment.name}}
        </a>
        (File size: {{aattachment.size}}, uploaded {{aattachment.changedAt}})
    </div>

    <div v-if="mode === 'grid'">
        <a :href="aattachment.download">
          <font-awesome-icon
            :icon="['far', 'file-'+ext(a)]"
            title="Open bookmarks"
          ></font-awesome-icon>
          {{aattachment.name}}
        </a>
        (File size: {{aattachment.size}}, uploaded {{aattachment.changedAt}})
    </div>

    <div v-if="mode === 'single' || 'gallery'" class="single">
        <div v-if="isImage(a)">
          <img :src="attachment.previewUrl" @click="openLightbox(index)" />
        </div>
        <div v-else>
          <font-awesome-icon
            :icon="['far', 'file-'+ext(a)]"
            title="Open bookmarks"
          ></font-awesome-icon>
          <a :href="attachment.download">
            Download
          </a>
        </div>
        {{a.name}}
    </div>
  </div>
</template>
<script>

export default {
  props: {
    kind: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      required: true,
    },

    value: {
      required: true,
    },
  },

  data () {
    return {
      attachment: {},
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (value) {
        console.log(value)
        // On input change resolve/load all attachments
        if (typeof value === 'string') {
          this.$crm.attachmentDetails({ kind: this.kind, attachmentID: value }).then(a => {
            this.attachment = a
          })
        } else {
          this.attachment = value
        }
      },
    },
  },
}
</script>

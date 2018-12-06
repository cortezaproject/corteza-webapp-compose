<template>
    <div>
      <div v-if="twitterHandle">
        <Timeline :id="twitterHandle" :sourceType="'profile'" :options="{ tweetLimit: '3' }">
          <div class="spinner"></div>
        </Timeline>
      </div>
      <div v-else>
        <div v-if="socialNetwork === ''">
          <p>No input for displaying social feed...</p>
        </div>
      </div>
    </div>
</template>
<script>
import base from './base'
import Timeline from 'vue-tweet-embed/timeline'
import { extractSocialUrl } from '../kind/SocialFeed'

export default {
  extends: base,

  components: {
    Timeline,
  },
  data () {
    return {
      url: '',
      twitterHandle: '',
      socialNetwork: '',
      socialFeed: null,
    }
  },
  methods: {
    extractSocialUrl (o) {
      return extractSocialUrl(o)
    },
  },
  created () {
    if (this.options) {
      var result = this.extractSocialUrl(this.options)
      this.url = result.url
      this.twitterHandle = result.twitterHandle
      this.socialNetwork = result.socialNetwork
    }
  },
  watch: {
    options: {
      handler () {
        if (this.options) {
          var result = this.extractSocialUrl(this.options)
          this.url = result.url
          this.twitterHandle = result.twitterHandle
          this.socialNetwork = result.socialNetwork
        }
      },

      deep: true,
    },
  },
}
</script>

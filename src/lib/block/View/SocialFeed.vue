<template>
    <div>
      <div v-if="social.twitterHandle">
        <Timeline :id="social.twitterHandle" sourceType="profile" :options="{ tweetLimit: '3' }">
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
import { extractSocialUrl } from '../SocialFeed'

export default {
  extends: base,

  components: {
    Timeline,
  },
  computed: {
    social () {
      if (this.options) {
        var result = this.extractSocialUrl(this.options)
        return {
          url: result.url,
          twitterHandle: result.twitterHandle,
          socialNetwork: result.socialNetwork,
        }
      }
      return {}
    },
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
}
</script>

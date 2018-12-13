<template>
    <div v-if="profile">
      <Timeline v-if="isTwitter" :id="profile.twitterHandle" sourceType="profile" :options="{ tweetLimit: '3' }">
        <div class="spinner"></div>
      </Timeline>
    </div>
    <div v-else>
      <p>No input for displaying social feed...</p>
    </div>
</template>
<script>
import base from './base'
import Timeline from 'vue-tweet-embed/timeline'
import { extractSocialUrl } from '../SocialFeed'

export default {
  extends: base,

  computed: {
    profile () {
      return extractSocialUrl(this.options.profileSourceField, this.options.profileUrl, this.record)
    },

    isTwitter () {
      return this.profile.socialNetwork === 'Twitter'
    },
  },

  components: {
    Timeline,
  },
}
</script>

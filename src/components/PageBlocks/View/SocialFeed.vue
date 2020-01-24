<template>
    <div v-if="profile">
      <timeline v-if="isTwitter" :id="profile.twitterHandle" sourceType="profile" :options="{ tweetLimit: 9 }">
        <div class="spinner"></div>
      </timeline>
    </div>
    <div v-else>
      <p>{{ $t('block.socialFeed.noInput') }}</p>
    </div>
</template>
<script>
import base from './base'
import { Timeline } from 'vue-tweet-embed'
// import { extractSocialUrl } from '../SocialFeed'
const extractSocialUrl = () => {} // temp

export default {
  components: {
    Timeline,
  },

  extends: base,

  computed: {
    profile () {
      return extractSocialUrl(this.options.profileSourceField, this.options.profileUrl, this.record)
    },

    isTwitter () {
      return this.profile.socialNetwork === 'Twitter'
    },
  },
}
</script>

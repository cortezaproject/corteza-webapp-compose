<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div v-if="profile">
      <timeline v-if="isTwitter" :id="profile.twitterHandle" sourceType="profile" :options="{ tweetLimit: 9 }">
        <div class="spinner"></div>
      </timeline>
    </div>
    <div v-else>
      <p>{{ $t('block.socialFeed.noInput') }}</p>
    </div>
  </wrap>
</template>
<script>
import base from './base'
import { Timeline } from 'vue-tweet-embed'

export default {
  components: {
    Timeline,
  },

  extends: base,

  computed: {
    profile () {
      return this.extractSocialUrl(this.options.profileSourceField, this.options.profileUrl, this.record)
    },

    isTwitter () {
      return this.profile.socialNetwork === 'Twitter'
    },
  },

  methods: {
    getTwitterHandle (url) {
      const twitterUnpacked = url.split('/')
      // the fourth item should be the handle
      if (twitterUnpacked.length === 4) {
        return twitterUnpacked[3]
      } else {
        // something strange with this twitter url
        return ''
      }
    },

    extractSocialUrl (profileSourceField, profileUrl, record = this.record) {
      let url = ''
      let socialNetwork = ''
      let twitterHandle = ''
      // check if we have a profileSourceField
      if (profileSourceField && profileSourceField.length > 0 && record) {
        const v = record.values[profileSourceField]
        url = (Array.isArray(v) && v.length > 0 ? v[0] : v)
      } else {
        // see if we can fail back to profileUrl
        if (profileUrl && profileUrl.length > 0) {
          url = profileUrl
        }
      }

      // is this a twitter url?
      if (url && url.indexOf('twitter.com')) {
        twitterHandle = this.getTwitterHandle(url)
        if (twitterHandle === '') {
          // failed to get twitter handle from the url
          twitterHandle = ''
          socialNetwork = ''
        } else {
          socialNetwork = 'Twitter'
        }
      } else {
        // this was not a twitter url
        url = ''
        socialNetwork = ''
      }

      return {
        url,
        socialNetwork,
        twitterHandle,
      }
    },
  },
}
</script>

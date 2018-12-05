<template>
    <div>
      <div v-if="twitterHandle">
        <Timeline :id="twitterHandle" :sourceType="'profile'" :options="{ tweetLimit: '3' }">
          <div class="spinner"></div>
        </Timeline>
      </div>
      <div v-else>
        <div v-if="twitterUrl">
          <p>No input for displaying social feed...</p>
        </div>
      </div>
    </div>
</template>
<script>
import base from './base'
import Timeline from 'vue-tweet-embed/timeline'
// import SocialFeed from '../kind/SocialFeed'

export default {
  extends: base,

  components: {
    Timeline,
  },
  data () {
    return {
      twitterURL: '',
      twitterHandle: '',
      socialFeed: null,
    }
  },
  methods: {
    getTwitterHandle (url) {
      var twitterUnpacked = url.split('/')
      // the fourth item should be the handle
      if (twitterUnpacked.length === 4) {
        return twitterUnpacked[3]
      } else {
        // something strange with this twitter url
        return null
      }
    },
    getTwitterUrl (o) {
      var twitterURL = ''
      var twitterHandle = ''
      // check if we have a profileSourceField
      if (o.profileSourceField && o.profileSourceField.length > 0) {
        twitterURL = o.profileSourceField
      } else {
        // see if we can fail back to profileUrl
        if (o.profileUrl && o.profileUrl.length > 0) {
          twitterURL = o.profileUrl
        }
      }

      // is this a twitter url?
      if (twitterURL.indexOf('twitter.com')) {
        twitterHandle = this.getTwitterHandle(twitterURL)
      } else {
        // this was not a twitter url
        twitterURL = null
      }

      return {
        twitterURL,
        twitterHandle,
      }
    },
  },
  created () {
    // test data
    this.options.profileSourceField = 'https://twitter.com/zorosa'
    this.options.profileUrl = 'https://twitter.com/zorosa'
    // end test data

    if (this.options) {
      var result = this.getTwitterUrl(this.options)
      this.twitterURL = result.twitterURL
      this.twitterHandle = result.twitterHandle
    }
  },
  watch: {
    options: {
      handler () {
        if (this.options) {
          var result = this.getTwitterUrl(this.options)
          this.twitterURL = result.twitterURL
          this.twitterHandle = result.twitterHandle
        }
      },

      deep: true,
    },
  },
}
</script>

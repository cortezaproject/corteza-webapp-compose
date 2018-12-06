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
import optionsPropMixin from './mixins/optionsProp'
import Timeline from 'vue-tweet-embed/timeline'
import { extractSocialUrl } from '../kind/SocialFeed'

/// ///////////////////////////////////
/// INFO: Custom class to Twitter timeline
/// add :widget-class="`my-custom-class-1 my-custom-class-2`"
/// to the <Timeline/> element
/// ///////////////////////////////////

export default {
  mixins: [
    optionsPropMixin,
  ],
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

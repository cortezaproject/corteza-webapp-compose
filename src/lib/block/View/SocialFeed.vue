<template>
    <div>
      <Timeline :id="this.options.twitter" :sourceType="'profile'" :options="{ tweetLimit: '3' }">
        <div class="spinner"></div>
      </Timeline>
    </div>
</template>
<script>
import base from './base'
import Timeline from 'vue-tweet-embed/timeline'

export default {
  extends: base,

  components: {
    Timeline,
  },
  created () {
    this.options.twitter = 'zorosa'
  },
}
</script>

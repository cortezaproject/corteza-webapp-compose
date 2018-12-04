<template>
    <div>
      <Timeline :id="this.options.twitter" :sourceType="'profile'" :options="{ tweetLimit: '3' }">
        <div class="spinner"></div>
      </Timeline>
    </div>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'
import Timeline from 'vue-tweet-embed/timeline'

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
  created () {
    this.options.twitter = 'zorosa'
  },
}
</script>

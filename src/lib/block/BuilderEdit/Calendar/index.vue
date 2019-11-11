<template>
  <div>
    <b-tab :title="$t('block.calendar.viewLabel')">
      <calendar-display v-bind="$attrs"
                        v-on="$listeners" />
    </b-tab>

    <b-tab :title="$t('block.calendar.feedLabel')">
      <feed-source v-bind="$attrs"
                   v-on="$listeners" />
    </b-tab>
  </div>
</template>

<script>
import { CalendarDisplay, FeedSource } from './loader'

export default {
  components: {
    CalendarDisplay,
    FeedSource,
  },

  inheritAttrs: false,
}
</script>

<template>
  <fieldset class="form-group">
    <b-form-group horizontal
                  :label="$t('block.calendar.calendarHeader')">

      <b-form-checkbox v-model="o.header.hide"
                       :value="true"
                       :unchecked-value="false">{{ $t('block.calendar.hideHeader') }}</b-form-checkbox>
      <b-form-checkbox v-model="o.header.hidePrevNext"
                       :disabled="o.header.hide"
                       value="true"
                       :unchecked-value="false">{{ $t('block.calendar.hideNavigation') }}</b-form-checkbox>
      <b-form-checkbox v-model="o.header.hideToday"
                       :disabled="o.header.hide"
                       :value="true"
                       :unchecked-value="false">{{ $t('block.calendar.hideToday') }}</b-form-checkbox>
      <b-form-checkbox v-model="o.header.hideTitle"
                       :disabled="o.header.hide"
                       :value="true"
                       :unchecked-value="false">{{ $t('block.calendar.hideTitle') }}</b-form-checkbox>

    </b-form-group>
    <b-form-group horizontal
                  :label="$t('block.calendar.view.enabled')">
      <b-form-checkbox-group v-model="o.header.views"
                             :disabled="o.header.hide"
                             buttons
                             button-variant="outline-secondary"
                             size="sm"
                             name="buttons2"
                             :options="views">
      </b-form-checkbox-group>
    </b-form-group>

    <b-form-group horizontal
                  :description="$t('block.calendar.view.footnote')"
                  :label="$t('block.calendar.view.default')">
      <b-form-radio-group v-model="o.defaultView"
                          buttons
                          button-variant="outline-secondary"
                          size="sm"
                          name="buttons2"
                          :options="views">
      </b-form-radio-group>
    </b-form-group>

    <hr/>

    <calendar-feed v-for="(f, i) in o.feeds"
          :key="i"
          :modules="modules"
          :feed="f"
          @removeFeed="onRemoveFeed(i)" />

    <b-button @click.prevent="handleAddButton" class="btn btn-url">{{ $t('block.calendar.addEventsSource') }}</b-button>
  </fieldset>
</template>
<script>
import { mapGetters } from 'vuex'
import base from '../base'
import CalendarFeed from './feed'
import Feed from 'corteza-webapp-compose/src/lib/block/Calendar/feed'

export default {
  components: {
    CalendarFeed,
  },

  extends: base,

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    views () {
      return this.o.constructor.availableViews()
        .map(view => ({ value: view, text: this.$t(`block.calendar.view.${view}`) }))
    },
  },

  created () {
    if (this.o.feeds.length === 0) {
      this.o.feeds = []
    }
  },

  methods: {
    /**
     * Handles feed removal
     * @param {Number} i Feed's index
     */
    onRemoveFeed (i) {
      this.o.feeds.splice(i, 1)
    },

    /**
     * Handles feed's addition
     */
    handleAddButton () {
      this.o.feeds.push(new Feed())
    },
  },
}
</script>

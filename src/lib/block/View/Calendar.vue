<template>
  <full-calendar v-if="calendar"
                 :events="events"
                 ref="fc"
                 v-bind="config"
                 @eventClick="handleEventClick" />

</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import base from './base'
import FullCalendar from '@fullcalendar/vue'
import { Calendar, cortezaTheme, resources } from 'corteza-webapp-compose/src/lib/block/Calendar'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

export default {
  components: {
    FullCalendar,
  },

  extends: base,

  data () {
    return {
      events: [],
      calendar: undefined,
      locale: undefined,

      loaded: {
        start: null,
        end: null,
      },
    }
  },

  computed: {
    ...mapGetters({
      pages: 'page/set',
    }),

    config () {
      if (!this.calendar) {
        return
      }

      return {
        header: this.calendar.getHeader(),
        height: 'parent',
        themeSystem: 'corteza',
        defaultView: this.calendar.defaultView,
        editable: false,
        eventLimit: true,
        locale: this.locale,
        // @todo could be loaded on demand
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          cortezaTheme,
        ],

        // Use available views to define custom view labels.
        // See src/i18n/en/compose.js for i18n definitons
        buttonText: Calendar.availableViews()
          .map(view => ({ view, label: this.$t(`block.calendar.view.${view}`) }))
          .reduce((acc, cur) => {
            acc[cur.view] = cur.label
            return acc
          }, {}),

        // Handle event fetching when view/date-range changes
        datesRender: ({ view: { currentStart, currentEnd } = {} } = {}) => {
          this.loadEvents(moment(currentStart), moment(currentEnd))
        },
      }
    },
  },

  watch: {
    options: {
      handler: function (opts) {
        this.calendar = new Calendar(opts)
        this.changeLocale(this.calendar.locale)
      },
      immediate: true,
    },

    'boundingRect.height': {
      handler: function () {
        // This is required, since vue-grid calculates grid item's dimensions
        // inside mounted hook
        setTimeout(() => {
          const fc = this.$refs.fc
          if (!fc) {
            return
          }
          fc.getApi().windowResize({ target: window })
        })
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
    }),

    // @todo listen for i18next locale change, and reload
    /**
     * Helper method to load requested locale.
     * See https://github.com/fullcalendar/fullcalendar/tree/master/packages/core/src/locales
     * for a full list
     * @param {String} lng Locale tag.
     */
    changeLocale (lng) {
      // fc doesn't provide a en locale
      if (lng === 'en') {
        lng = 'en-gb'
      }

      this.locale = require(`@fullcalendar/core/locales/${lng}`)
    },

    /**
     * Loads & preps fc events from `start` to `end` for all defined feeds.
     * @param {Moment} start Start date
     * @param {Moment} end End date
     */
    loadEvents (start, end) {
      if (!start || !end) {
        return
      }

      if (start.isSame(this.loaded.start) && end.isSame(this.loaded.end)) {
        return
      }

      this.loaded.start = start
      this.loaded.end = end

      this.events = []
      this.options.feeds.forEach(feed => {
        switch (feed.resource) {
          case resources.module:
            this.findModuleByID({ namespaceID: this.namespace.namespaceID, moduleID: feed.options.moduleID })
              .then((module) => {
                this.calendar.moduleFeed(this.$ComposeAPI, module, this.namespace, feed, this.loaded)
                  .then(events => {
                    this.events.push(...events)
                  })
              })
            break
          case resources.reminder:
            this.calendar.reminderFeed(this.$SystemAPI, this.$auth, feed, this.loaded)
              .then(events => {
                this.events.push(...events)
              })
            break
        }
      })
    },

    /**
     * Based on event type, perform some action.
     * @param {Event} event Fullcalendar event object
     */
    handleEventClick ({ event: { extendedProps: { recordID, moduleID } } }) {
      if (!moduleID || !recordID) {
        return
      }

      const page = this.pages.find(p => p.moduleID === moduleID)
      if (!page) {
        return
      }

      this.$router.push({ name: 'page.record', params: { recordID, pageID: page.pageID } })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@fullcalendar/list/main.css';

/deep/.fc-event {
  &.text-light {
    color: $white;
  }

  &.text-dark {
    color: $black;
  }
}

</style>

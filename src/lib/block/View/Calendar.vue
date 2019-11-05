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
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import FullCalendar from '@fullcalendar/vue'
import { Calendar, cortezaTheme } from 'corteza-webapp-compose/src/lib/block/Calendar'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { removeDup } from 'corteza-webapp-compose/src/common/scripts'

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
        this.findModuleByID({ namespaceID: this.namespace.namespaceID, moduleID: feed.moduleID }).then((module) => {
          // We will need this for redirecting user to record page
          const page = (this.pages.find(p => p.moduleID === module.moduleID) || {})

          // Build params from feed configutation
          const params = {
            namespaceID: this.namespace.namespaceID,
            moduleID: module.moduleID,
            filter: `date(${feed.startField}) >= '${start.toISOString()}' AND date(${feed.endField || feed.startField}) < '${end.toISOString()}'`,
          }

          this.$ComposeAPI.recordList(params).then(({ set }) => {
            removeDup(set, 'recordID')
              .map(r => new Record(module, r))
              .filter(r => !!r.values[feed.startField] || !!r[feed.startField])
              .forEach(r => {
                // Expand recort into FC events
                this.expandRecord(r, feed, page, this.events)
              })
          }).catch(this.defaultErrorHandler(this.$t('notification.record.listLoadFailed')))
        })
      })
    },

    /**
     * Method expands the given record in a (set) of FC event objects.
     * Handles basic recurrence -- multiple date fields.
     * @param {Record} record Record to expand
     * @param {Object} feed Feed, this record belongs to
     * @param {Object} page Page, this record belongs to
     * @param {Array} events Array to hold the generated events
     */
    expandRecord (record, feed, page, events) {
      let starts, ends

      // Determine available start values
      const sf = record.module.fields.find(({ name }) => name === feed.startField)
      if (!sf) {
        starts = [ record[feed.startField] ]
      } else {
        starts = sf.isMulti ? record.values[feed.startField] : [ record.values[feed.startField] || null ]
      }

      // Determine available end values
      const ef = record.module.fields.find(({ name }) => name === feed.endField)
      if (!ef) {
        ends = [ record[feed.endField] || null ]
      } else {
        ends = ends = ef.isMulti ? record.values[feed.endField] : [ record.values[feed.endField] || null ]
      }

      // Make sure ends is atleast as long as starts, to avoid length checks
      ends.push(...(new Array(Math.max(starts.length - ends.length, 0)).fill(null)))

      starts.forEach((start, i) => {
        events.push({
          // So FC knows how to group these expanded events
          groupId: record.recordID,
          id: record.recordID,
          title: record.values[feed.titleField] || record.recordID,
          start: start,
          end: ends[i],
          allDay: feed.allDay,
          classNames: [ 'event', 'event-record' ],

          extendedProps: {
            recordID: record.recordID,
            pageID: page.pageID,
          },
        })
      })
    },

    /**
     * Based on event type, perform some action.
     * @param {Event} event Fullcalendar event object
     */
    handleEventClick ({ event: { extendedProps: { recordID, pageID } } }) {
      if (recordID && pageID) {
        this.$router.push({ name: 'page.record', params: { recordID, pageID } })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@fullcalendar/list/main.css';

/deep/.event {
  &.event-record {
    background-color: $primary;
    color: $white;
    border-color: $primary;

    &:hover {
      color: $white;
    }
  }
}

</style>

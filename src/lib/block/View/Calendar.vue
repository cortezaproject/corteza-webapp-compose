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

        buttonText: Calendar.availableViews()
          .map(view => ({ view, label: this.$t(`block.calendar.view.${view}`) }))
          .reduce((acc, cur) => {
            acc[cur.view] = cur.label
            return acc
          }, {}),

        // Listeners
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
    changeLocale (lng) {
      // fc doesn't provide a en locale
      if (lng === 'en') {
        lng = 'en-gb'
      }

      this.locale = require(`@fullcalendar/core/locales/${lng}`)
    },

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
          const pageID = (this.pages.find(p => p.moduleID === module.moduleID) || {}).pageID

          // Build params from feed configutation
          const params = {
            namespaceID: this.namespace.namespaceID,
            moduleID: module.moduleID,
            filter: `date(${feed.startField}) >= '${start.toISOString()}' AND date(${feed.endField || feed.startField}) < '${end.toISOString()}'`,
          }

          this.$ComposeAPI.recordList(params).then(({ set }) => {
            this.events.push(...set
              .map(r => new Record(module, r))
              .filter(r => !!r.values[feed.startField] || !!r[feed.startField])
              .map(r => {
                return {
                  id: r.recordID,
                  title: r.values[feed.titleField] || r.recordID,
                  start: r.values[feed.startField] || r[feed.startField],
                  end: feed.endField ? (r.values[feed.endField] || r[feed.endField]) : null,
                  allDay: feed.allDay,

                  extendedProps: {
                    recordID: r.recordID,
                    pageID,
                  },
                }
              })
            )
          }).catch(this.defaultErrorHandler(this.$t('notification.record.listLoadFailed')))
        })
      })
    },

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

</style>

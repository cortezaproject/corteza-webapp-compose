<template>
  <full-calendar :events="events"
                 :config="config"
                 :key="calDep"></full-calendar>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import base from './base'
import { FullCalendar } from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.css'
import './fcLocales'
import Record from '@/lib/record'
import { Calendar } from '@/lib/block/Calendar'

const locale = 'en'
export default {
  components: {
    FullCalendar,
  },

  extends: base,

  data () {
    return {
      // For the lack of better idea how to solve this...
      // we're using this as calendar component key and changing
      // it according to boundingRect.height (that is changed whenever
      // window is resized. To overcome problems on mount, we increment
      // this integer when component is mounted and then again .3sec later
      calDep: 0,
      events: [],
    }
  },

  computed: {
    ...mapGetters({
      pages: 'page/set',
    }),

    config () {
      return {
        header: this.header,
        height: 'parent',
        themeSystem: 'standard',
        defaultView: this.options.defaultView || 'month',
        editable: false,
        eventLimit: true,
        locale,
        eventClick: this.handleEventClick,
        viewRender: ({ start, end }) => {
          this.loadEvents(start, end)
        },
      }
    },

    header () {
      const cal = new Calendar(this.options)
      const h = cal.header || {}
      if (h.hide) return false

      // Show view buttons only when 2 or more are selected
      let right = false
      if (h.views.length >= 2) {
        right = cal.reorderViews(h.views).join(',')
      }

      const header = {
        left: `${h.hidePrevNext ? '' : 'prev,next'} ${h.hideToday ? '' : 'today'}`.trim(),
        center: `${h.hideTitle ? '' : 'title'}`,
        right,
      }

      return header
    },
  },

  watch: {
    'boundingRect.height' (v) {
      this.calDep = v
    },
  },

  mounted () {
    this.$nextTick(() => {
      this.calDep++
      window.setTimeout(() => {
        this.calDep++
      }, 300)
    })
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
    }),

    loadEvents (start, end) {
      this.events = []
      this.options.feeds.forEach(feed => {
        this.findModuleByID({ moduleID: feed.moduleID }).then((module) => {
          // We will need this for redirecting user to record page
          const pageID = (this.pages.find(p => p.moduleID === module.moduleID) || {}).pageID

          // Build params from feed configutation
          const params = {
            moduleID: module.moduleID,
            filter: `date(${feed.endField || feed.startField}) >= '${start.toISOString()}' AND date(${feed.startField}) < '${end.toISOString()}'`,
          }

          this.$crm.recordList(params).then(({ meta, records }) => {
            this.events.push(...records
              .map(r => new Record(module, r))
              .filter(r => !!r.values[feed.startField])
              .map(r => {
                return {
                  id: r.recordID,
                  title: r.values[feed.titleField] || r.recordID,
                  start: r.values[feed.startField],
                  end: feed.endField ? r.values[feed.endField] : null,
                  allDay: feed.allDay,
                  pageID,
                }
              }))
          }).catch(this.defaultErrorHandler(this.$t('notification.record.listLoadFailed')))
        })
      })
    },

    handleEventClick ({ id, pageID }) {
      if (id && pageID) {
        this.$router.push({ name: 'public.page.record', params: { pageID, recordID: id } })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.btn {
  border-radius: 0;
  margin-bottom: 5px;
}

</style>

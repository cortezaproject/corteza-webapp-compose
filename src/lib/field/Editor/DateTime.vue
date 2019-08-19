<template>
  <b-form-group :label="field.label || field.name">
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <b-form-input v-if="!field.options.onlyTime"
                    type="date"
                    v-b-tooltip.hover :title="$t(dateRule)"
                    @change="setDate($event, ctx.index)"
                    :value="getDate(ctx.index)" />
      <b-form-input v-if="!field.options.onlyDate"
                    type="time"
                    @change="setTime($event, ctx.index)"
                    :value="getTime(ctx.index)" />
    </multi>

    <b-form-input v-if="!field.options.onlyTime && !field.isMulti"
                  type="date"
                  class="d-inline w-50"
                  v-b-tooltip.hover :title="$t(dateRule)"
                  v-model="date" />
    <b-form-input v-if="!field.options.onlyDate && !field.isMulti"
                  type="time"
                  class="d-inline w-50"
                  v-model="time" />

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
</template>
<script>
import base from './base'
import moment from 'moment'

import { checkFuturePast } from 'corteza-webapp-compose/src/lib/field/DateTime'

export default {
  extends: base,
  computed: {
    dateRule () {
      if (this.field.options.onlyFutureValues) {
        return 'field.kind.dateTime.warning.pastValuesOnly'
      } else if (this.field.options.onlyPastValues) {
        return 'field.kind.dateTime.warning.futureValuesOnly'
      } else {
        return ''
      }
    },
    date: {
      get () {
        return this.getDate()
      },
      set (d) {
        this.setDate(d)
      },
    },
    time: {
      get () {
        return this.getTime()
      },
      set (t) {
        this.setTime(t)
      },
    },
  },

  methods: {
    getTime (index = undefined) {
      if (this.value && this.value.length > 0) {
        let dt = []
        const value = index !== undefined ? this.value[index] : this.value
        if (value) {
          dt = value.split(' ')
        }

        if (dt.length > 1) {
          return dt[1] // we only want the time part
        } else if (dt.length === 1) {
          // If we time is in the value
          if (dt[0].indexOf(':') > -1) {
            return dt[0]
          }
        }
      }
      return ''
    },

    setTime (t, index = undefined) {
      if (t && t.length > 1) {
        let tm = moment()
        let date = this.getDate(index)
        if (this.field.options.onlyTime) {
          tm = moment(t, 'HH:mm')
          tm = tm.format('HH:mm')
        } else {
          if (!date) {
            // If no date is yet set default to today
            date = moment().format('YYYY-MM-DD')
          }
          tm = moment(date + ' ' + t, 'YYYY-MM-DD HH:mm')
          tm = tm.format('YYYY-MM-DD HH:mm')
        }
        if (index !== undefined) {
          this.value = Object.assign([], this.value, { [index]: tm })
        } else {
          this.value = tm
        }
      }
    },

    getDate (index = undefined) {
      if (this.value && this.value.length > 0) {
        if (this.value === 'Invalid date') {
          // Make sure this weird value does not cause us problems
          return ''
        }

        let dt = []
        if (index !== undefined) {
          dt = this.value[index].split(' ')
        } else {
          dt = this.value.split(' ')
        }
        if (dt.length > 1) {
          return dt[0] // we only want the date part
        } else if (dt.length === 1) {
          // If date is in the value
          if (dt[0].indexOf('-') > -1) {
            return dt[0]
          }
        }
      }
      return ''
    },

    setDate (d, index = undefined) {
      if (d && d.length > 1) {
        let dm = moment()
        const time = this.getTime(index)
        if (this.field.options.onlyDate) {
          dm = moment(d, 'YYYY-MM-DD')
          // check for valid dates as per rules
          dm = checkFuturePast(dm,
            this.field.options.onlyFutureValues,
            this.field.options.onlyPastValues,
            this.field.options.onlyDate,
            this.field.options.onlyTime)
          dm = dm.format('YYYY-MM-DD')
        } else {
          dm = moment(d + ' ' + time, 'YYYY-MM-DD HH:mm')
          // check for valid dates as per rules
          dm = checkFuturePast(dm,
            this.field.options.onlyFutureValues,
            this.field.options.onlyPastValues,
            this.field.options.onlyDate,
            this.field.options.onlyTime)
          dm = dm.format('YYYY-MM-DD HH:mm')
        }

        if (index !== undefined) {
          this.value = Object.assign([], this.value, { [index]: dm })
        } else {
          this.value = dm
        }
      }
    },
  },
}
</script>

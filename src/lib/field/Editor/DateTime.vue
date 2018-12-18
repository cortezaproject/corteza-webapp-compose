<template>
  <div class="form-group">
    {{ field.label || field.name }}
    <b-form-input
    v-if="!field.options.onlyTime"
      type="date"
      v-b-tooltip.hover :title="dateRule"
      v-model="date" />
    <b-form-input
      type="time"
      v-model="time" />
  </div>
</template>
<script>
import base from './base'
import moment from 'moment'

import { checkFuturePast } from '@/lib/field/DateTime'

export default {
  extends: base,
  computed: {
    dateRule () {
      if (this.field.options.onlyFutureValues) {
        return 'Only dates in the future will be saved!'
      } else if (this.field.options.onlyPastValues) {
        return 'Only dates in the past will be saved!'
      } else {
        return ''
      }
    },
    date: {
      get () {
        if (this.value && this.value.length > 1) {
          return this.value.split(' ')[0] // we only want the date part
        }
        return ''
      },
      set (d) {
        if (d && d.length > 1) {
          var dm = moment()
          if (this.field.options.onlyDate) {
            dm = moment(d, 'YYYY-MM-DD')
            // check for valid dates as per rules
            dm = checkFuturePast(dm,
              this.field.options.onlyFutureValues,
              this.field.options.onlyPastValues,
              this.field.options.onlyDate,
              this.field.options.onlyTime)
            this.value = dm.format('YYYY-MM-DD')
          } else {
            dm = moment(d + ' ' + this.time, 'YYYY-MM-DD HH:mm')
            // check for valid dates as per rules
            dm = checkFuturePast(dm,
              this.field.options.onlyFutureValues,
              this.field.options.onlyPastValues,
              this.field.options.onlyDate,
              this.field.options.onlyTime)
            this.value = dm.format('YYYY-MM-DD HH:mm')
          }
        }
      },
    },
    time: {
      get () {
        if (this.value && this.value.length > 0) {
          return this.value.split(' ')[1] // we only want the time part
        }
        return ''
      },
      set (t) {
        if (t && t.length > 1) {
          var tm = moment()
          if (this.field.options.onlyTime) {
            tm = moment(t, 'HH:mm')
            this.value = tm.format('HH:mm')
          } else {
            tm = moment(this.date + ' ' + t, 'YYYY-MM-DD HH:mm')
            this.value = tm.format('YYYY-MM-DD HH:mm')
          }
        }
      },
    },
  },
}
</script>

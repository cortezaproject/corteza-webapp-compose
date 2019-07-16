<template>
  <b-form-group :label="field.label || field.name">
    <b-form-input v-if="!field.options.onlyTime"
                  type="date"
                  v-b-tooltip.hover :title="$t(dateRule)"
                  v-model="date" />
    <b-form-input v-if="!field.options.onlyDate"
                  type="time"
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
        if (this.value && this.value.length > 1) {
          if (this.value === 'Invalid date') {
            // Make sure this weird value does not cause us problems
            return ''
          }

          const split = this.value.split(' ')
          if (split.length > 1) {
            return split[0] // we only want the date part
          } else if (split.length === 1) {
            // If date is in the value
            if (split[0].indexOf('-') > -1) {
              return split[0]
            }
          }
        }
        return ''
      },
      set (d) {
        if (d && d.length > 1) {
          let dm = moment()
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
          const split = this.value.split(' ')
          if (split.length > 1) {
            return split[1] // we only want the time part
          } else if (split.length === 1) {
            // If we time is in the value
            if (split[0].indexOf(':') > -1) {
              return split[0]
            }
          }
        }
        return ''
      },
      set (t) {
        if (t && t.length > 1) {
          let tm = moment()
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

<style scoped lang="scss">

input[type='date'] {
  width: calc(((100% / 3) *2) - 10px);
  display: inline-block;
  margin-right: 10px;
}

input[type='time'] {
  width: calc(100% / 3);
  display: inline-block;
}

</style>

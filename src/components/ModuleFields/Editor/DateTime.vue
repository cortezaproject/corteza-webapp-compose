<template>
  <b-form-group
    :label="label"
    :class="formGroupStyleClasses"
  >
    <multi
      v-if="field.isMulti"
      :value.sync="value"
      v-slot="ctx">
      <b-form-input
        type="date"
        v-if="!field.options.onlyTime"
        v-b-tooltip.hover :title="$t(dateRule)"
        @change="setDate($event, ctx.index)"
        :value="getDate(ctx.index)"
        :required="field.isRequired"
        :state="state"
      />
      <b-form-input
        type="time"
        v-if="!field.options.onlyDate"
        @change="setTime($event, ctx.index)"
        :value="getTime(ctx.index)"
        :required="field.isRequired"
        :state="state"
      />
      <errors :errors="errors" />
    </multi>

    <template
      v-else
      >
      <b-form-input
        type="date"
        v-if="!field.options.onlyTime && !field.isMulti"
        v-b-tooltip.hover
        v-model="date"
        :required="field.isRequired"
        class="d-inline w-50"
        :title="$t(dateRule)"
        :state="state"
      />
      <b-form-input
        type="time"
        v-if="!field.options.onlyDate && !field.isMulti"
        v-model="time"
        class="d-inline w-50"
        :required="field.isRequired"
        :state="state"
      />

      <errors :errors="errors" />
    </template>
  </b-form-group>
</template>
<script>
import base from './base'
import moment from 'moment'

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
            .format('YYYY-MM-DD')
        } else {
          dm = moment(d + ' ' + time, 'YYYY-MM-DD HH:mm')
            .format('YYYY-MM-DD HH:mm')
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

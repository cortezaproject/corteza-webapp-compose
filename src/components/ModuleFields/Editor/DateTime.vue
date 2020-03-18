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
        :value="getDate(ctx.index)"
        :required="field.isRequired"
        :state="state"
        @change="setDate($event, ctx.index)"
      />
      <b-form-input
        type="time"
        v-if="!field.options.onlyDate"
        :value="getTime(ctx.index)"
        :required="field.isRequired"
        :state="state"
        @change="setTime($event, ctx.index)"
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
        class="d-inline w-50"
        :value="getDate()"
        :required="field.isRequired"
        :title="$t(dateRule)"
        :state="state"
        @change="setDate($event)"
      />
      <b-form-input
        type="time"
        v-if="!field.options.onlyDate && !field.isMulti"
        class="d-inline w-50"
        :value="getTime()"
        :required="field.isRequired"
        :state="state"
        @change="setTime($event)"
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

  data () {
    return {
      date: null,
      time: null,
    }
  },

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

  },

  watch: {
    value: {
      immediate: true,
      handler () {
        this.date = this.getDate()
        this.time = this.getTime()
      },
    },
  },

  methods: {
    getTime (index) {
      if (this.value && this.value.length > 0) {
        if (this.value === 'Invalid date') {
          // Make sure this weird value does not cause us problems
          return ''
        }

        const time = index !== undefined ? this.value[index] : this.value
        return moment(time).local().format('HH:mm')
      }
      return ''
    },

    setTime (time, index) {
      if (time && time.length > 1) {
        let tm
        let date = this.getDate(index)

        if (this.field.options.onlyTime) {
          tm = moment(time, 'HH:mm').utc().format()
        } else {
          if (!date) {
            // If no date is yet set default to today
            date = moment().format('YYYY-MM-DD')
          }
          tm = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm').utc().format()
        }

        if (index !== undefined) {
          this.value = Object.assign([], this.value, { [index]: tm })
        } else {
          this.value = tm
        }
      }
    },

    getDate (index) {
      if (this.value && this.value.length > 0) {
        if (this.value === 'Invalid date') {
          // Make sure this weird value does not cause us problems
          return ''
        }

        const date = index !== undefined ? this.value[index] : this.value
        return moment(date).local().format('YYYY-MM-DD')
      }
      return ''
    },

    setDate (date, index) {
      if (date && date.length > 1) {
        let dm = moment()
        let time = this.getTime(index)

        if (this.field.options.onlyDate) {
          dm = moment(date, 'YYYY-MM-DD').utc().format()
        } else {
          if (!time) {
            // If no date is yet set default to today
            time = moment().format('HH:mm')
          }
          dm = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm').utc().format()
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

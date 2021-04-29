<template>
  <b-form-group
    label-class="text-primary"
    :class="formGroupStyleClasses"
  >
    <template #label>
      <div
        v-if="!valueOnly"
        class="d-flex align-items-top"
      >
        <label
          class="mb-0"
        >
          {{ label }}
        </label>

        <hint
          :text="hint"
          :id="field.fieldID"
        />
      </div>
      <small
        class="form-text font-weight-light text-muted"
      >
        {{ description }}
      </small>
    </template>

    <multi
      v-if="field.isMulti"
      v-slot="ctx"
      :value.sync="value"
    >
      <b-form-input
        v-if="!field.options.onlyTime"
        v-b-tooltip.hover
        :title="$t(dateRule)"
        type="date"
        class="mr-2"
        :value="getDate(ctx.index)"
        :required="field.isRequired"
        :state="state"
        :class="{ 'd-inline w-50': !field.options.onlyDate }"
        @change="setDate($event, ctx.index)"
      />
      <b-form-input
        v-if="!field.options.onlyDate"
        type="time"
        class="mr-2"
        :value="getTime(ctx.index)"
        :required="field.isRequired"
        :state="state"
        :class="{ 'd-inline w-50': !field.options.onlyTime }"
        @change="setTime($event, ctx.index)"
      />
      <errors :errors="errors" />
    </multi>

    <template
      v-else
    >
      <b-form-input
        v-if="!field.options.onlyTime"
        v-model="date"
        v-b-tooltip.hover
        :title="$t(dateRule)"
        type="date"
        :value="getDate()"
        :required="field.isRequired"
        :state="state"
        :class="{ 'd-inline w-50': !field.options.onlyDate }"
      />
      <b-form-input
        v-if="!field.options.onlyDate"
        v-model="time"
        type="time"
        :value="getTime()"
        :required="field.isRequired"
        :state="state"
        @change="setTime($event)"
        :class="{ 'd-inline w-50': !field.options.onlyTime }"
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
        return 'field.kind.dateTime.warning.futureValuesOnly'
      } else if (this.field.options.onlyPastValues) {
        return 'field.kind.dateTime.warning.pastValuesOnly'
      } else {
        return ''
      }
    },

    date: {
      get () {
        return this.getDate()
      },
      set (date) {
        this.setDate(date)
      },
    },
    time: {
      get () {
        return this.getTime()
      },
      set (time) {
        this.setTime(time)
      },
    },
  },

  methods: {
    getTime (index = undefined) {
      if (this.value && this.value.length > 0) {
        if (this.value === 'Invalid date') {
          // Make sure this weird value does not cause us problems
          return ''
        }

        const time = index !== undefined ? this.value[index] : this.value
        if (this.field.options.onlyTime) {
          return moment(time, 'HH:mm').format('HH:mm')
        } else {
          return moment(time).local().format('HH:mm')
        }
      }
      return ''
    },

    setTime (time, index = undefined) {
      if (time && time.length > 1) {
        let tm
        if (this.field.options.onlyTime) {
          tm = moment(time, 'HH:mm').format('HH:mm')
        } else {
          let date = this.getDate(index)
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

    getDate (index = undefined) {
      if (this.value && this.value.length > 0) {
        if (this.value === 'Invalid date') {
          // Make sure this weird value does not cause us problems
          return ''
        }

        const date = index !== undefined ? this.value[index] : this.value
        if (this.field.options.onlyDate) {
          return moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
        } else {
          return moment(date).local().format('YYYY-MM-DD')
        }
      }
      return ''
    },

    setDate (date, index = undefined) {
      if (date && date.length > 1) {
        let dm

        if (this.field.options.onlyDate) {
          dm = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
        } else {
          let time = this.getTime(index)
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

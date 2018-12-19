<script>
import base from './base'
import moment from 'moment'
import { getRelativeDateTime } from '@/lib/field/DateTime'

export default {
  extends: base,
  computed: {
    formatted () {
      if (this.field.options.outputRelative) {
        var now = moment()
        var val = moment()
        // are we dealing with date, time or both?
        if (this.field.options.onlyDate) {
          val = moment(this.value, 'YYYY-MM-DD')
          // is it in the past?
          if (val < now) {
            return getRelativeDateTime(val, now, this.field.options.onlyDate, this.field.options.onlyTime) + 'ago'
          } else {
            return 'In ' + getRelativeDateTime(now, val, this.field.options.onlyDate, this.field.options.onlyTime)
          }
        } else if (this.field.options.onlyTime) {
          val = moment(this.value, 'HH:mm')
          if (val < now) {
            return getRelativeDateTime(val, now, this.field.options.onlyDate, this.field.options.onlyTime) + 'ago'
          } else {
            return 'In ' + getRelativeDateTime(now, val, this.field.options.onlyDate, this.field.options.onlyTime)
          }
        } else {
          val = moment(this.value, 'YYYY-MM-DD HH:mm')
          if (val < now) {
            return getRelativeDateTime(val, now, this.field.options.onlyDate, this.field.options.onlyTime) + 'ago'
          } else {
            return 'In ' + getRelativeDateTime(now, val, this.field.options.onlyDate, this.field.options.onlyTime)
          }
        }
      }
      return this.value
    },
  },
  methods: {

  },
}
</script>

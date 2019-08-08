// @todo option to allow only time entry
// @todo option to allow multiple entries
// @todo option to allow duplicates
import moment from 'moment'

export class DateTime {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ format, onlyDate, onlyTime, onlyPastValues, onlyFutureValues, outputRelative, multiDelimiter } = {}) {
    this.format = format || ''
    this.onlyDate = !!onlyDate
    this.onlyTime = !!onlyTime
    this.onlyPastValues = !!onlyPastValues
    this.onlyFutureValues = !!onlyFutureValues
    this.outputRelative = !!outputRelative
    this.multiDelimiter = multiDelimiter ? (typeof multiDelimiter === 'string' ? multiDelimiter : '\n') : this.multiDelimiter

    return this
  }

  formatValue (value) {
    if (value === 'Invalid date') {
      return null
    }

    const m = moment(value)

    if (this.outputRelative) {
      return m.fromNow()
    } else if (this.format.length > 0) {
      return m.format(this.format)
    } else if (this.onlyTime) {
      return moment(value, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD', 'HH:mm']).format('HH:mm')
    } else if (this.onlyDate) {
      return m.format('YYYY-MM-DD')
    } else {
      return m.format('YYYY-MM-DD HH:mm')
    }
  }

  export () {
    return {
      format: this.format,
      onlyDate: this.onlyDate,
      onlyTime: this.onlyTime,
      onlyPastValues: this.onlyPastValues,
      onlyFutureValues: this.onlyFutureValues,
      outputRelative: this.outputRelative,
    }
  }
}

export function checkPast (value, onlyPast, onlyDate, onlyTime) {
  if (onlyPast) {
    // make sure value is in the past
    if (value < moment()) {
      return value
    }
    return moment()
  }
}

export function checkFuture (value, onlyFuture, onlyDate, onlyTime) {
  if (onlyFuture) {
    // make sure value is in the future
    if (value > moment()) {
      return value
    }
    return moment()
  }
}

export function checkFuturePast (value, onlyFuture, onlyPast, onlyDate, onlyTime) {
  // check future
  if (onlyFuture) {
    value = checkFuture(value, onlyFuture, onlyDate, onlyTime)
  } else if (onlyPast) {
    // check past
    value = checkPast(value, onlyPast, onlyDate, onlyTime)
  }

  return value
}

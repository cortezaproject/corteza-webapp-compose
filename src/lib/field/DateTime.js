// @todo option to allow only time entry
// @todo option to allow multiple entries
// @todo option to allow duplicates
import moment from 'moment'

export class DateTime {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ onlyDate, onlyTime, onlyPastValues, onlyFutureValues, outputRelative } = {}) {
    this.onlyDate = onlyDate || false
    this.onlyTime = onlyTime || false
    this.onlyPastValues = onlyPastValues || false
    this.onlyFutureValues = onlyFutureValues || false
    this.outputRelative = outputRelative || false

    return this
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

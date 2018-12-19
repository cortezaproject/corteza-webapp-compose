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

export function getRelativeDateTime (end, start, onlyDate, onlyTime) {
  var diff = start.diff(end, 'milliseconds')
  var duration = moment.duration(diff)
  var result = ''
  if (duration.years() !== 0 && !onlyTime) {
    result = duration.years()
    if (duration.years() > 1) {
      result += ' years '
    } else {
      result += ' year '
    }
  }
  if (duration.months() !== 0 && !onlyTime) {
    result += duration.months()
    if (duration.months() > 1) {
      result += ' months '
    } else {
      result += ' month '
    }
  }
  if (duration.days() !== 0 && !onlyTime) {
    result += duration.days()
    if (duration.days() > 1) {
      result += ' days '
    } else {
      result += ' day '
    }
  }
  if (duration.hours() !== 0 && !onlyDate) {
    result += duration.hours()
    if (duration.hours() > 1) {
      result += ' hours '
    } else {
      result += ' hour '
    }
  }
  if (duration.minutes() !== 0 && !onlyDate) {
    result += duration.minutes()
    if (duration.minutes() > 1) {
      result += ' minutes '
    } else {
      result += ' minute '
    }
  }
  return result
}

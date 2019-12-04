// @todo option to allow only time entry
// @todo option to allow multiple entries
// @todo option to allow duplicates
import moment from 'moment'
import i18next from 'i18next'

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
    this.multiDelimiter = multiDelimiter ? (typeof multiDelimiter === 'string' ? multiDelimiter : '\n') : '\n'

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

  /**
   * Checks if given value is in the future
   * @param {String|Array<String>} v Value (in DateTime) to check
   * @param {Moment} now Time reference
   * @returns {undefined|String} undefined if valid, Error string if invalid
   */
  checkFuture (v, now) {
    if (!this.onlyFutureValues) {
      return undefined
    }

    if (!Array.isArray(v)) {
      v = [v]
    }
    if (v.find(v => moment(v) < now)) {
      const err = 'notification.field-datetime.valueNotFuture'
      return i18next.t(err) || err
    }
    return undefined
  }

  /**
   * Checks if given value is in the past
   * @param {String|Array<String>} v Value (in DateTime) to check
   * @param {Moment} now Time reference
   * @returns {undefined|String} undefined if valid, Error string if invalid
   */
  checkPast (v, now) {
    if (!this.onlyPastValues) {
      return undefined
    }

    if (!Array.isArray(v)) {
      v = [v]
    }
    if (v.find(v => moment(v) > now)) {
      const err = 'notification.field-datetime.valueNotPast'
      return i18next.t(err) || err
    }
  }

  /**
   * Checks if given value is valid for this field
   * @param {String} v Value (in DateTime) to check
   * @param {Moment} now Reference time used to compare
   * @returns {Array<>} Array of issues; empty if none
   */
  validate (v, now = moment()) {
    let err = this.checkFuture(v, now)
    err = err || this.checkPast(v, now)

    if (err) {
      return [err]
    }

    return []
  }
}

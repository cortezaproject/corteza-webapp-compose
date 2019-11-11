import { resources } from './'

/**
 * Feed class represents an event feed for the given calendar
 */
export default class Feed {
  constructor (f = {}) {
    f = fromLegacy(f)

    this.resource = f.resource
    this.options = { ...f.options }
    this.startField = f.startField
    this.endField = f.endField
    this.allDay = !!f.allDay
    this.titleField = f.titleField
  }
}

/**
 * Helper function to handle legacy feed configurations
 * @param {Object} f Possible legacy field
 * @returns {Object}
 */
function fromLegacy (f) {
  if (f.resource) {
    return f
  }

  return {
    resource: resources.record,
    options: {
      moduleID: f.moduleID,
    },
    startField: f.startField,
    endField: f.endField,
    allDay: f.allDay,
    titleField: f.titleField,
  }
}

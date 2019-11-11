import { makeColors } from './colors'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import { removeDup } from 'corteza-webapp-compose/src/common/scripts'
import variables from 'corteza-webapp-compose/src/themes/corteza-base/variables.scss'

const defaultColor = variables.primary

/**
 * Loads & converts module resource into FC events
 * @param {ComposeAPI} $ComposeAPI ComposeAPI provider
 * @param {Module} module Current module
 * @param {Namespace} namespace Current namespace
 * @param {Feed} feed Current feed
 * @param {Object} range Current date range
 * @returns {Promise<Array>} Resolves to a set of FC events to display
 */
export default async function ($ComposeAPI, module, namespace, feed, range) {
  // Params for record fetching
  const params = {
    namespaceID: namespace.namespaceID,
    moduleID: module.moduleID,
    filter: `date(${feed.startField}) >= '${range.start.toISOString()}' AND date(${feed.endField || feed.startField}) < '${range.end.toISOString()}'`,
  }

  if (feed.options.prefilter) {
    params.filter += ` AND (${feed.options.prefilter})`
  }

  const events = []
  return $ComposeAPI.recordList(params).then(({ set }) => {
    removeDup(set, 'recordID')
      .map(r => new Record(module, r))
      .filter(r => !!r.values[feed.startField] || !!r[feed.startField])
      .forEach(r => events.push(...expandRecord(r, feed)))
    return events
  })
}

/**
 * Method expands the given record in a (set) of FC event objects.
 * Handles basic recurrence -- multiple date fields.
 * @param {Record} record Record to expand
 * @param {Feed} feed Feed, this record belongs to
 * @returns {Array} A set of expanded events
 */
function expandRecord (record, feed) {
  let starts, ends
  const events = []

  // Determine available start values
  const sf = record.module.fields.find(({ name }) => name === feed.startField)
  if (!sf) {
    starts = [ record[feed.startField] ]
  } else {
    starts = sf.isMulti ? record.values[feed.startField] : [ record.values[feed.startField] || null ]
  }

  // Determine available end values
  const ef = record.module.fields.find(({ name }) => name === feed.endField)
  if (!ef) {
    ends = [ record[feed.endField] || null ]
  } else {
    ends = ends = ef.isMulti ? record.values[feed.endField] : [ record.values[feed.endField] || null ]
  }

  // Make sure ends is atleast as long as starts, to avoid length checks
  ends.push(...(new Array(Math.max(starts.length - ends.length, 0)).fill(null)))

  const classNames = [ 'event', 'event-record' ]
  const { backgroundColor, borderColor, isLight } = makeColors(feed.options.color || defaultColor)
  if (isLight) {
    classNames.push('text-dark')
  } else {
    classNames.push('text-light')
  }

  starts.forEach((start, i) => {
    events.push({
      // So FC knows how to group these expanded events
      groupId: record.recordID,
      id: record.recordID,
      title: record.values[feed.titleField] || record.recordID,
      start: start,
      end: ends[i],
      allDay: feed.allDay,
      backgroundColor,
      borderColor,
      classNames,

      extendedProps: {
        moduleID: record.module.moduleID,
        recordID: record.recordID,
      },
    })
  })

  return events
}

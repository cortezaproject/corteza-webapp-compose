import { PropCast, ID } from 'corteza-webapp-common/src/lib/types/common'
import { compose } from '@cortezaproject/corteza-js'

export class RecordOrganizer {
  /**
   * Record organizer
   *
   * @param {object} o
   * @property {string} o.moduleID
   * @property {string} o.labelField
   * @property {string} o.descriptionField
   * @property {string} o.filter
   * @property {string} o.positionField
   * @property {string} o.groupField
   * @property {string} o.group
   *
   * @returns {RecordOrganizer}
   */
  constructor (o = {}) {
    this.moduleID = PropCast(ID, o.moduleID)
    this.labelField = PropCast(String, o.labelField)
    this.descriptionField = PropCast(String, o.descriptionField)
    this.filter = PropCast(String, o.filter)
    this.positionField = PropCast(String, o.positionField)
    this.groupField = PropCast(String, o.groupField)
    this.group = PropCast(String, o.group)
  }

  /**
   * Reposition and optionally move record to a different group
   *
   * This is only a helper function and we do not keep any hard dependencies on
   * the API client.
   *
   * @param {Compose}           $ComposeAPI Compose API client
   * @param {Record}            record,     Record we're moving
   * @param {Number}            position    New position
   * @param {String|undefined}  group       New group
   * @returns {Promise<void>}
   */
  async moveRecord ($ComposeAPI, record, position, group = undefined) {
    const { namespaceID, moduleID, recordID } = record

    if (moduleID !== this.moduleID) {
      throw Error('Record incompatible, module mismatch')
    }

    const { filter, positionField, groupField } = this
    const args = {
      recordID,
      filter,
      positionField,
      position,
    }

    if (group !== undefined) {
      // If group is set (empty string is a valid!
      args.groupField = groupField
      args.group = group || ''
    }

    const params = {
      procedure: 'organize',
      namespaceID,
      moduleID,
      // map kv to [{ name: k, value: v }, ...]
      args: Object.keys(args).map(name => ({ name, value: String(args[name]) })),
    }

    return $ComposeAPI.recordExec(params)
  }

  /**
   * Fetches group of records using configured options & module
   *
   * @param {Compose}           $ComposeAPI Compose API client
   * @param {Module}            module Module to use for assembling API request & casting results
   * @param {String}            filter Filter records
   * @returns {Promise<Record[]>}
   */
  async fetchRecords ($ComposeAPI, module, filter = this.filter) {
    if (module.moduleID !== this.moduleID) {
      throw Error('Module incompatible, module mismatch')
    }

    const { positionField: sort } = this
    const { moduleID, namespaceID } = module

    const params = {
      namespaceID,
      moduleID,
      filter,
      sort,
    }

    return $ComposeAPI
      .recordList(params)
      .then(({ set }) => set.map(r => Object.freeze(new compose.Record(module, r))))
  }
}

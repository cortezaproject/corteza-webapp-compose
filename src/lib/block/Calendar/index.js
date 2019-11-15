import { PropCast } from 'corteza-webapp-common/src/lib/types/common'
import { reminderFeed, recordFeed } from './feedLoader'
import Feed from './feed'

export { default as cortezaTheme } from './theme'

// Map of < V4 view names to >= V4 view names
const legacyViewMapping = {
  month: 'dayGridMonth',
  agendaMonth: 'dayGridMonth',
  agendaWeek: 'timeGridWeek',
  agendaDay: 'timeGridDay',
  listMonth: 'listMonth',
}

export const resources = {
  record: 'compose:record',
  reminder: 'system:reminder',
}

/**
 * Helper class to help define calendar's functionality
 */
export class Calendar {
  constructor (o = {}) {
    this.defaultView = Calendar.handleLegacyViews(PropCast(String, o.defaultView)) || 'dayGridMonth'
    this.feeds = (o.feeds || []).map(f => new Feed(f))
    this.header = o.header || {}
    this.header = { ...this.header, views: Calendar.handleLegacyViews(this.header.views || []) }
    this.locale = o.locale || 'en-gb'

    this.reminderFeed = reminderFeed
    this.recordFeed = recordFeed
  }

  /**
   * Generates a header object of fullcalendar
   * @returns {Object}
   */
  getHeader () {
    const h = this.header
    if (h.hide) {
      return false
    }

    // Show view buttons only when 2 or more are selected
    let right = false
    if (h.views.length >= 2) {
      right = this.reorderViews(h.views).join(',')
    }

    const header = {
      left: `${h.hidePrevNext ? '' : 'prev,next'} ${h.hideToday ? '' : 'today'}`.trim(),
      center: `${h.hideTitle ? '' : 'title'}`,
      right,
    }

    return header
  }

  /**
   * Provides a list of available views.
   * @note When adding new ones, make sure included plugins support it.
   * @returns {Array}
   */
  static availableViews () {
    return [
      'dayGridMonth',
      'timeGridWeek',
      'timeGridDay',
      'listMonth',
    ]
  }

  /**
   * Reorder views according to available views array order.
   * @param {Array} views Array of views to filter & sort
   */
  reorderViews (views = []) {
    return Calendar.availableViews()
      .filter(v => views.find(fv => fv === v))
      .map(v => v)
  }

  /**
   * Converts old < V4 view names to >= V4 view names.
   * @note It wil preserve fields that don't need to/can't be converted
   * @param {Array} views Array of updated view names
   */
  static handleLegacyViews (views) {
    if (!Array.isArray(views)) {
      return legacyViewMapping[views] || views
    }
    return views.map(v => legacyViewMapping[v] || v)
  }
}

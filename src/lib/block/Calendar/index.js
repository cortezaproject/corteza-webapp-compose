import { PropCast } from 'corteza-webapp-common/src/lib/types/common'

export { default as cortezaTheme } from './theme'

const legacyViewMapping = {
  month: 'dayGridMonth',
  agendaMonth: 'dayGridMonth',
  agendaWeek: 'timeGridWeek',
  agendaDay: 'timeGridDay',
  listMonth: 'listMonth',
  listWeek: 'listWeek',
  listDay: 'listDay',
}

export class Calendar {
  constructor (o = {}) {
    this.defaultView = Calendar.handleLegacyViews(PropCast(String, o.defaultView)) || 'dayGridMonth'
    this.feeds = o.feeds || []
    this.header = o.header || {}
    this.header = { ...this.header, views: Calendar.handleLegacyViews(this.header.views || []) }
    this.locale = o.locale || 'en-gb'
  }

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

  static availableViews () {
    return [
      'dayGridMonth',
      'timeGridWeek',
      'timeGridDay',
      'listMonth',
      'listWeek',
      'listDay',
    ]
  }

  // Reorder views according to availableViews array order
  reorderViews (views = []) {
    return Calendar.availableViews()
      .filter(v => views.find(fv => fv === v))
      .map(v => v)
  }

  static handleLegacyViews (views) {
    if (!Array.isArray(views)) {
      return legacyViewMapping[views] || views
    }
    return views.map(v => legacyViewMapping[v] || v)
  }
}

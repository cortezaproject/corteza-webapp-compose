import { PropCast } from 'corteza-webapp-common/src/lib/types/common'
import i18next from 'i18next'

export class Calendar {
  constructor (o = {}) {
    this.defaultView = PropCast(String, o.defaultView) || this.defaultView || undefined
    this.feeds = o.feeds || this.feeds || []
    this.header = o.header || this.header || {}
  }

  availableViews () {
    return [
      { value: 'month',
        text: i18next.t('block.calendar.view.month') },
      { value: 'agendaMonth',
        text: i18next.t('block.calendar.view.agendaMonth') },
      { value: 'agendaWeek',
        text: i18next.t('block.calendar.view.agendaWeek') },
      { value: 'agendaDay',
        text: i18next.t('block.calendar.view.agendaDay') },
      { value: 'listMonth',
        text: i18next.t('block.calendar.view.listMonth') },
      { value: 'listWeek',
        text: i18next.t('block.calendar.view.listWeek') },
      { value: 'listDay',
        text: i18next.t('block.calendar.view.listDay') },
    ]
  }

  // Reorder views according to availableViews array order
  reorderViews (views = []) {
    return this.availableViews().filter(v => views.includes(v.value)).map(v => v.value)
  }
}

export class Calendar {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ feeds, header, defaultView } = {}) {
    this.feeds = feeds || this.feeds || []
    this.defaultView = defaultView || this.defaultView || undefined
    this.header = header || this.header || {}
    return this
  }

  availableViews () {
    return [
      { value: 'month',
        text: 'Month' },
      { value: 'agendaMonth',
        text: 'Month agenda' },
      { value: 'agendaWeek',
        text: 'Week agenda' },
      { value: 'agendaDay',
        text: 'Day agenda' },
      { value: 'listMonth',
        text: 'Month list' },
      { value: 'listWeek',
        text: 'Week list' },
      { value: 'listDay',
        text: 'Day list' },
    ]
  }

  // Reorder views according to availableViews array order
  reorderViews (views = []) {
    return this.availableViews().filter(v => views.includes(v.value)).map(v => v.value)
  }
}

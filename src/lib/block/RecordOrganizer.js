export class RecordOrganizer {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ moduleID, labelField, descriptionField, prefilter, presortField, settingField, settingValue } = {}) {
    this.moduleID = moduleID || undefined
    this.labelField = labelField || undefined
    this.descriptionField = descriptionField || undefined
    this.prefilter = prefilter || undefined
    this.presortField = presortField || undefined
    this.settingField = settingField || undefined
    this.settingValue = settingValue || undefined
    return this
  }
}

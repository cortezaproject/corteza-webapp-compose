const stdEventTypes = [
  'onManual',
]

export default {
  compose: [
    ...stdEventTypes,
  ],
  'compose:namespace': [
    ...stdEventTypes,
  ],
  'compose:module': [
    ...stdEventTypes,
  ],
  'compose:record': [
    ...stdEventTypes,
  ],
  'ui:compose:record-page': [
    'beforeFormSubmit',
    'onFormSubmitError',
    'afterFormSubmit',
    'beforeDelete',
    'afterDelete',
  ],
}

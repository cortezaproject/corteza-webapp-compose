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
    'beforeDelete',
    'afterDelete',
    'afterFormSubmit',
    'beforeFormSubmit',
  ],
}

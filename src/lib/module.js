import BaseModule, { systemFields as baseSystemFields } from 'corteza-webapp-common/src/lib/types/compose/module'
import { ArrayOf, PropCast } from 'corteza-webapp-common/src/lib/types/common'
import Field from './field'

// Remap system fields to Field object
const systemFields = Object.freeze(baseSystemFields.map(f => new Field(f)))

// Keeping this class here for a while (until we move all fields there as well)
export default class Module extends BaseModule {
  constructor (m = {}) {
    super(m)
    // Override fields from common with the ones we use in compose
    this.fields = PropCast(ArrayOf(Field), m.fields, [])
  }

  systemFields () {
    return systemFields
  }
}

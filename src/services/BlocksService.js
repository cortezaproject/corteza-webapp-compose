import SharedService from '@/services/SharedService'
import _ from 'lodash'

export default class BlocksService {
  /**
   * Clone blocks to deal with mobile view
   * @param {*} blocks
   */
  static cloneBlocksForMobileView (blocks) {
    // Clone layout object
    const blocksForMobile = SharedService.cloneObject(blocks)

    // Group blocks by y
    const groupedByY = _.groupBy(blocksForMobile, 'y')

    // Order all groups by x (asc)
    const orderedByYAndX = _.map(groupedByY, group => {
      return _.orderBy(group, ['x'], ['asc'])
    })

    // Flatten array
    const flattened = _.flatten(orderedByYAndX)

    // Increment all y
    // All x at 0
    // All w at 1
    flattened.forEach((block, index, array) => {
      array[index].y = index
      array[index].x = 0
      array[index].w = 1
    })

    return SharedService.cloneObject(flattened)
  }

  /**
   * Populate fields in blocks content : fieldsID => fields from API
   * @param {*} page
   * @param {*} block
   * @param {*} $crm TODO Better way ?
   */
  static async cloneBlocksAndPopulate (page, blocks, $crm) {
    if (!blocks) {
      return []
    }
    const blocksHere = SharedService.cloneObject(blocks)
    const promises = []
    blocksHere.forEach(block => {
      promises.push(BlocksService.populateBlock(page, block, $crm))
    })
    await Promise.all(promises)
    return blocksHere
  }

  /**
   * Populate fields in content : fieldsID => fields from API
   * @param {*} page
   * @param {*} block
   * @param {*} $crm TODO Better way ?
   */
  static async populateBlock (page, block, $crm) {
    // populate fields of LIST CONTENT TYPE
    if (
      block.content.list &&
      block.content.list.fieldsID &&
      block.content.list.moduleID
    ) {
      const module = await $crm.moduleRead({ id: block.content.list.moduleID })
      block.content.list.module = module
      block.content.list.fields = []
      block.content.list.fieldsID.forEach(id => {
        module.fields.forEach(fieldOfModule => {
          if (fieldOfModule.id === id) {
            block.content.list.fields.push(fieldOfModule)
          }
        })
      })
    }
    // populate fields of FIELDS CONTENT TYPE
    if (block.content.fieldsID && page.module) {
      block.content.fields = []
      block.content.fieldsID.forEach(id => {
        page.module.fields.forEach(fieldOfModule => {
          if (fieldOfModule.id === id) {
            block.content.fields.push(fieldOfModule)
          }
        })
      })
    }
  }

  /**
   * Return fields available to be selected on a block.
   * Indeed : a field cannot be in 2 blocks.
   * @param {*} page
   * @param {*} blocks
   */
  static getContentFieldsAvailable (page, blocks) {
    const allFieldsAvailableForPage = page.module ? page.module.fields : []
    const allFieldsAvailableForPageIndexedById = {}
    allFieldsAvailableForPage.forEach(value => {
      allFieldsAvailableForPageIndexedById[value.id] = value
    })
    const contentFieldsAvailableById = SharedService.cloneObject(
      allFieldsAvailableForPageIndexedById
    )
    blocks.forEach(value => {
      if (value.content && value.content.fields) {
        value.content.fields.forEach(valueField => {
          delete contentFieldsAvailableById[valueField.id]
        })
      }
    })
    return Object.values(contentFieldsAvailableById)
  }
}

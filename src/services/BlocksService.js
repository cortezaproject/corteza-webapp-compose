
import SharedService from '@/services/SharedService'
import _ from 'lodash'

export default class BlocksService {
  static cloneBlocksForMobileView (blocks) {
    // Clone layout object
    const blocksForMobile = SharedService.cloneObject(blocks)

    // Group blocks by y
    const groupedByY = _.groupBy(blocksForMobile, 'y')

    // Order all groups by x (asc)
    const orderedByYAndX = _.map(groupedByY, (group) => {
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
}

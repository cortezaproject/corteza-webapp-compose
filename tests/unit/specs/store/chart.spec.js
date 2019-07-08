/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import chart from 'corteza-webapp-compose/src/store/chart'



describe('store/chart.js', () => {
  it('it should properly set item in store', function () {
    const store = chart({})
    store.mutations['updateSet'](store.state, [{ chartID: '123' }])
    expect(store.state.set).to.have.lengthOf(1)
    expect(store.state.set[0]).to.have.property('chartID', '123')
  })

  it('it should properly remove item from store', function () {
    const store = chart({})
    store.state.set = [{ chartID: '123' }]
    store.mutations['removeFromSet'](store.state, [{ chartID: '321' }])
    expect(store.state.set).to.have.lengthOf(1)
    store.mutations['removeFromSet'](store.state, [{ chartID: '123' }])
    expect(store.state.set).to.have.lengthOf(0)
  })
})

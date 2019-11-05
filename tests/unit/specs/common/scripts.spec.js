import { expect } from 'chai'
import { removeDup } from 'corteza-webapp-compose/src/common/scripts'

describe('src/common/scripts.js', () => {
  it('removeDup', () => {
    const tests = [
      {
        name: 'remove duplicate objects',
        set: [{ id: '1' }, { id: '2' }, { id: '2' }, { id: '1' }, { id: '3' }],
        key: 'id',
        expect: function (set) {
          expect(set, this.name).to.have.length(3)
          set.forEach(({ id }, i) => {
            expect(id, this.name).to.eq(`${i + 1}`)
          })
        },
      },
    ]

    for (const t of tests) {
      const cc = removeDup(t.set, t.key)
      t.expect(cc)
    }
  })
})

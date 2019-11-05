import { expect } from 'chai'
import { removeDup, toRGBA } from 'corteza-webapp-compose/src/common/scripts'

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

  it('toRGBA', () => {
    const tests = [
      {
        name: 'valid input',
        v: [200, 200, 200, 0.5],
        expected: 'rgba(200, 200, 200, 0.5)',
      },
      {
        name: 'undeflown values',
        v: [-5, -5, -5, 0.5],
        expected: 'rgba(250, 250, 250, 0.5)',
      },
      {
        name: 'overflown values',
        v: [260, 260, 260, 0.5],
        expected: 'rgba(5, 5, 5, 0.5)',
      },
    ]

    for (const t of tests) {
      expect(toRGBA(t.v, t.key), t.name).to.eq(t.expected)
    }
  })
})

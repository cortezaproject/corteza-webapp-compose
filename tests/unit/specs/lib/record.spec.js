/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import Module from '@/lib/module'
import Field from '@/lib/field'
import Record from '@/lib/record'

const M = new Module({
  fields: [
    new Field({name: 'str', kind: 'String'}),
    new Field({name: 'num', kind: 'Number'}),
    new Field({name: 'multi', kind: 'String', isMulti: true }),
  ]
})

function make(values) {
  return new Record(M, { values })
}


describe('lib/record.js', () => {
  it('should properly translate value-set (from backend)', function () {
    const record = make([
      { name: 'str', value: 'should be overwritten...' },
      { name: 'str', value: 'SomeString' },
      { name: 'num', value: 123 },
      { name: 'multi', value: 'a' },
      { name: 'multi', value: 'b' },
      { name: 'multi', value: 'c' },
    ])
    expect(record.values.str).to.equal('SomeString')
    expect(record.values.num).to.equal(123)
    expect(record.values.multi).to.deep.equal(['a','b','c'])
  })

  it('should properly translate k-v values', function () {
    const record = make()

    record.values = [
      { name: 'str', value: 'should be overwritten...' },
      { name: 'str', value: 'SomeString' },
      { name: 'num', value: 123 },
      { name: 'multi', value: 'a' },
      { name: 'multi', value: 'b' },
      { name: 'multi', value: 'c' },
    ]

    expect(record.values.str).to.equal('SomeString')
    expect(record.values.num).to.equal(123)
    expect(record.values.multi).to.deep.equal(['a','b','c'])
  })

  it('should properly translate k-v values', function () {
    const record = make()

    record.values = {
      str: 'SomeString',
      num: 123,
      multi: ['a','b','c'],
    }

    expect(record.values.str).to.equal('SomeString')
    expect(record.values.num).to.equal(123)
    expect(record.values.multi).to.deep.equal(['a','b','c'])
  })

  it('should properly append values to multi value fields', function () {
    const record = make({ multi: ['a','b','c'] })

    expect(record.values.multi).to.deep.equal(['a','b','c'])
    record.values.multi = ['a','b','c','d','e']
    expect(record.values.multi).to.deep.equal(['a','b','c','d','e'])
  })

  it('should properly serialize into json', function () {
    const record = make({ str: 'string', num: 5, multi: ['a'] })
    const serialized = `[{"name":"str","value":"string"},{"name":"num","value":"5"},{"name":"multi","value":"a"}]`

    expect(JSON.stringify(record.values)).to.equal(serialized)
    expect(JSON.stringify(record)).contains(`"values":`+serialized)
  })

  it('should properly handle numeric values', function () {
    const record = make({num: 123})

    record.values.num = 2
    expect(record.values.num).to.equal(2)
    record.values.num++
    expect(record.values.num).to.equal(3)
    record.values.num = 1 + record.values.num
    expect(record.values.num).to.equal(4)
  })
})

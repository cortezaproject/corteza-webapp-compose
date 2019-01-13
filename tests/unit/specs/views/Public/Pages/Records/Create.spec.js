/* eslint-disable */
/* ESLint didn't like some expects */

import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Create from '@/views/Public/Pages/Records/Create'
import Module from '@/lib/module'
import Field from '@/lib/field'
import Record from '@/lib/record'


// var should = require('chai').should()

describe('Create', () => {

  it('properly links passed record reference', () => {
    const refRecModule = new Module({moduleID: '2002'})
    const refRecord = new Record(refRecModule, { recordID: '1000' })

    const cmp = shallowMount(Create, {
      propsData: {
        page: {
          module: new Module({
            moduleID: '2001',
            fields: [
              new Field({ name: 'ref', kind: 'Record', options: { moduleID: refRecModule.moduleID }}),
            ],
          })
        },

        refRecord
      }
    })

    expect(cmp.vm.record).not.to.be.an('undefined')
    expect(cmp.vm.record.values.ref).not.to.be.an('undefined')
    expect(cmp.vm.record.values.ref).to.equal(refRecord.recordID)
  })
})

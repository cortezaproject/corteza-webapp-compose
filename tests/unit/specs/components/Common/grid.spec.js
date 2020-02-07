// /* eslint-disable */
// import { expect } from 'chai'
// import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
// import Grid from 'corteza-webapp-compose/src/components/Common/Grid'
// import Block from 'corteza-webapp-compose/src/lib/block'
// import { GridLayout, GridItem } from 'vue-grid-layout'
//
// describe('components/Common/Grid.vue', () => {
//   let propsData
//   const mountGrid = (opt) => shallowMount(Grid, {
//     mocks: {},
//     propsData,
//     ...opt,
//   })
//
//   beforeEach(() => {
//     propsData = {
//       blocks: [],
//     }
//   })
//
//   describe('prepare grid', () => {
//     beforeEach(() => {
//       propsData.blocks = [
//         new Block({
//           kind: 'Content',
//           xywh: [ 0, 0, 0, 0 ],
//         }),
//         new Block({
//           kind: 'Content',
//           xywh: [ 0, 0, 0, 0 ],
//         })
//       ]
//     })
//
//     it('on init', () => {
//       const wrap = mountGrid()
//
//       expect(wrap.findAll(GridItem)).to.have.length(2)
//     })
//
//     it('on update', () => {
//       const wrap = mountGrid()
//
//       wrap.setProps({
//         blocks: [
//           new Block({
//             kind: 'Content',
//             xywh: [ 0, 0, 0, 0 ],
//           }),
//         ],
//       })
//
//       expect(wrap.findAll(GridItem)).to.have.length(1)
//     })
//
//     it('de structure Block object', () => {
//       propsData.blocks = [
//         new Block({
//           kind: 'Content',
//           xywh: [ 1, 2, 3, 4 ],
//         }),
//       ]
//       const wrap = mountGrid()
//
//       const [ gb ] = wrap.vm.grid
//       expect(gb).to.deep.eq({ x: 1, y: 2, w: 3, h: 4, i: 0 })
//     })
//   })
//
//   describe('on layout update', () => {
//     beforeEach(() => {
//       propsData.blocks = [
//         new Block({
//           title: 'title1',
//           kind: 'Content',
//           xywh: [ 0, 0, 0, 0 ],
//           options: {},
//           style: {},
//         }),
//         new Block({
//           title: 'title2',
//           kind: 'Content',
//           xywh: [ 0, 0, 0, 0 ],
//           options: {},
//           style: {},
//         })
//       ]
//     })
//
//     it('emit a block update', () => {
//       const wrap = mountGrid()
//
//       expect(wrap.emitted()['update:blocks']).to.be.undefined
//       const ly = wrap.find(GridLayout)
//       ly.vm.$emit('layout-updated', [])
//       expect(wrap.emitted()['update:blocks']).to.not.be.undefined
//     })
//
//     it('update block\'s params', () => {
//       const tb = new Block({
//         kind: 'Content',
//         xywh: [0, 0, 0, 0],
//       })
//
//       const wrap = mountGrid()
//
//       const ly = wrap.find(GridLayout)
//       ly.vm.$emit('layout-updated', [
//         { x: 1, y: 1, w: 1, h: 1, i: 0 },
//         { x: 2, y: 2, w: 2, h: 2, i: 1 },
//       ])
//       const emt = wrap.emitted()['update:blocks'].pop().pop()
//       for (const e of emt) {
//         expect(e).to.have.all.keys(Object.keys(tb))
//       }
//     })
//
//     it('map updated blocks to correct blocks', () => {
//       const wrap = mountGrid()
//
//       const ly = wrap.find(GridLayout)
//       ly.vm.$emit('layout-updated', [
//         { x: 1, y: 1, w: 1, h: 1, i: 0 },
//         { x: 2, y: 2, w: 2, h: 2, i: 1 },
//       ])
//       const test = [
//         { title: 'title1', xywh: [1, 1, 1, 1] },
//         { title: 'title2', xywh: [2, 2, 2, 2] },
//       ]
//       const emt = wrap.emitted()['update:blocks'].pop().pop()
//       for (let i = 0; i < test.length; i++) {
//         expect(emt[i]).to.deep.include(test[i])
//       }
//     })
//   })
// })

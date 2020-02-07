// /* eslint-disable */
// import { expect } from 'chai'
// import Select from 'corteza-webapp-compose/src/lib/field/Configurator/Select'
//
// describe.skip('src/lib/field/Configurator/Select.vue', () => {
//   it('determine new option\'s state', () => {
//     const tests = [
//       {
//         name: 'valid state',
//         options: [{ text: 'opt1l', value: 'opt1v' }],
//         option: { text: 'opt2l', value: 'opt2v' },
//         state: null,
//       },
//       {
//         name: 'invalid state - dup text',
//         options: [{ text: 'opt1l', value: 'opt1v' }],
//         option: { text: 'opt1l', value: 'opt2v' },
//         state: false,
//       },
//       {
//         name: 'invalid state - dup value',
//         options: [{ text: 'opt1l', value: 'opt1v' }],
//         option: { text: 'opt2l', value: 'opt1v' },
//         state: false,
//       },
//     ]
//
//     const fnc = Select.computed.newOptState
//     for (const t of tests) {
//       const local = {
//         newOption: t.option,
//         f: { options: { options: t.options } }
//       }
//       expect(fnc.call(local), t.name).to.eq(t.state)
//     }
//   })
// })

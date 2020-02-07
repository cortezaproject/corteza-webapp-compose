// /* eslint-disable */
// /* ESLint didn't like some expects */
//
// import { expect } from 'chai'
// import { Calendar } from 'corteza-webapp-compose/src/lib/block/Calendar'
//
// describe('lib/block/Calendar', () => {
//   describe('legacy views', () => {
//     it('should be able to handle legacy view names', () => {
//       const tests = [
//         {
//           name: 'should convert old views to new views',
//           defaultView: 'month',
//           header: { views: [ 'month', 'agendaMonth', 'agendaWeek', 'agendaDay', 'listMonth', 'listWeek', 'listDay' ] },
//           expect: ({ defaultView, header: { views } }, t) => {
//             expect(views.join(''), t.name + '-views').to.not.eq(t.header.views.join(''))
//             expect(defaultView, t.name + '-default view').to.not.eq('month')
//           },
//         },
//         {
//           name: 'should preserve any new views',
//           defaultView: 'dayGridMonth',
//           header: { views: [ 'month', 'dayGridMonth' ] },
//           expect: ({ defaultView, header: { views } }, t) => {
//             expect(views.join(''), t.name).to.not.includes('month')
//             expect(defaultView, t.name + '-default view').to.eq('dayGridMonth')
//           },
//         },
//       ]
//
//       for (const t of tests) {
//         t.expect(new Calendar(t), t)
//       }
//     })
//   })
//
//   describe('getHeader', () => {
//     it('should return false if header is hidden', () => {
//       const tests = [
//         { name: 'header should be shown', header: {}, expect: 'object' },
//         { name: 'header should be hidden', header: { hide: true }, expect: 'boolean' },
//       ]
//
//       for (const t of tests) {
//         const cc = new Calendar(t)
//         expect(typeof cc.getHeader(), t.name).to.eq(t.expect)
//       }
//     })
//
//     it('should generate list of views (right)', () => {
//       const tests = [
//         { name: 'should not show if only 1 view', header: { views: ['dayGridMonth'] }, expect: false },
//         { name: 'should provide a string list if multiple views', header: { views: ['dayGridMonth', 'timeGridWeek'] }, expect: 'dayGridMonth,timeGridWeek' },
//       ]
//
//       for (const t of tests) {
//         const cc = new Calendar(t)
//         expect(cc.getHeader().right, t.name).to.eq(t.expect)
//       }
//     })
//
//     it('should filter, order list of views (right)', () => {
//       const tests = [
//         { name: 'preserve correct order', header: { views: ['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listMonth'] }, expect: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' },
//         { name: 'correct order', header: { views: ['listMonth', 'dayGridMonth', 'timeGridDay', 'timeGridWeek'] }, expect: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' },
//         { name: 'filter & correct order', header: { views: ['listMonth', 'dayGridMonth', 'timeGridDay', 'no', 'timeGridWeek'] }, expect: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' },
//       ]
//
//       for (const t of tests) {
//         const cc = new Calendar(t)
//         expect(cc.getHeader().right, t.name).to.eq(t.expect)
//       }
//     })
//
//     it('should generate navigation (left)', () => {
//       const tests = [
//         { name: 'should include prev, next nav', header: {}, expect: ({ left }, t) => expect(left, t.name).includes('prev,next') },
//         { name: 'should exclude prev, next nav if so specified', header: { hidePrevNext: true }, expect: ({ left }, t) => expect(left, t.name).to.not.includes('prev,next') },
//
//         { name: 'should include today nav', header: {}, expect: ({ left }, t) => expect(left, t.name).to.includes('today') },
//         { name: 'should exclude today nav if so specified', header: { hideToday: true }, expect: ({ left }, t) => expect(left, t.name).to.not.includes('today') },
//       ]
//
//       for (const t of tests) {
//         const cc = new Calendar(t)
//         t.expect(cc.getHeader(), t)
//       }
//     })
//   })
// })

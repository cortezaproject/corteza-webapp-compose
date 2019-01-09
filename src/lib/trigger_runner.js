import Record from './record'

export default function (set, action, ctx) {
  let { module } = ctx

  ctx = {
    Record,
    action,
    ...ctx,
  }

  set = (set || []).filter(t => t.runnable({ module, action }))

  for (let i = 0; i < set.length; i++) {
    if (!set[i].run(ctx)) {
      return false
    }
  }

  return true
}

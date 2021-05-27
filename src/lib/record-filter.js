// Helper to determine if and value for given bool query
// == is intentional
const toBoolean = (v) => {
  /* eslint-disable eqeqeq */
  if (v == 'false' || v == 0) {
    return false
  }
  if (v == 'true' || v == 1) {
    return true
  }

  return undefined
}

// Helper function that creates a query for a specific field kind
export function getFieldFilter (field, query) {
  const boolQuery = toBoolean(query)
  const numQuery = Number.parseFloat(query)

  // To SQLish LIKE param
  const strQuery = query
    // replace * with %
    .replace(/[*%]+/g, '%')
    // Remove all trailing * and %
    .replace(/[%]+$/, '')
    // Remove all leading * and %
    .replace(/^[%]+/, '')

  if (field.kind === 'Number' && !isNaN(numQuery)) {
    return `${field.name} = ${numQuery}`
  }

  // Boolean should search for literal values. Example `${field.name} = true` or just `${field.name}
  // At the moment it doesn't seem to be working as intended
  if (field.kind === 'Bool' && boolQuery !== undefined) {
    if (boolQuery) {
      return `${field.name} = true`
    } else {
      return `${field.name} = false OR ${field.name} IS NULL`
    }
  }

  if (['String', 'Url', 'Select', 'Email'].includes(field.kind)) {
    return `${field.name} LIKE '%${strQuery}%'`
  }
}

// Takes fields and prefilter and merges it query expression over all columns we're showing
// ie: Return records that have strings in columns (fields) we're showing that start with <query> in case
//     of text or are exactly the same in case of numbers
export function queryToFilter (query = '', prefilter = '', fields = []) {
  query = (query || '').trim()

  if (!query) {
    return prefilter || ''
  }

  // When searching, always reset filter with prefilter + query
  query = fields
    .map(qf => getFieldFilter(qf, query))
    .filter(q => !!q)
    .join(' OR ')

  if (prefilter) {
    return `(${prefilter}) AND (${query})`
  }

  return query
}

// Evaluates the given prefilter. Allows JS template literal expressions
// such as id = ${recordID}
export function evaluatePrefilter (prefilter, { record, recordID, ownerID, userID }) {
  return (function (prefilter) {
    /* eslint-disable no-eval */
    return eval('`' + prefilter + '`')
  })(prefilter)
}

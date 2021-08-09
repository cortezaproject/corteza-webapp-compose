import moment from 'moment'

// Generate record list sql query string based on filter object input

export function getRecordListFilterSql (filter) {
  let query = ''

  let existPeviousElement = false
  filter.forEach((f, index) => {
    if (f.name && f.value && f.operator) {
      if (existPeviousElement) {
        query += ` ${f.condition} `
      }
      query += getFieldFilter(f.name, f.kind, f.value, f.operator)
      existPeviousElement = true
    }
  })

  return query ? `(${query})` : query
}

// Helper function that creates a query for a specific field kind
export function getFieldFilter (name, kind, query, operator = '') {
  const boolQuery = toBoolean(query)
  const numQuery = Number.parseFloat(query)

  // Boolean should search for literal values. Example `${name} = true` or just `${name}
  // At the moment it doesn't seem to be working as intended

  if (kind === 'Bool') {
    if (operator) {
      if (operator === '=') {
        return `${name} is ${query}`
      } else {
        return `${name} is not ${query}`
      }
    } else if (boolQuery !== undefined) {
      if (boolQuery) {
        return `${name} is true`
      } else {
        return `${name} is false OR ${name} IS NULL`
      }
    }
  }

  // To SQLish LIKE param
  const strQuery = query
    // replace * with %
    .replace(/[*%]+/g, '%')
    // Remove all trailing * and %
    .replace(/[%]+$/, '')
    // Remove all leading * and %
    .replace(/^[%]+/, '')

  if (['Number'].includes(kind) && !isNaN(numQuery)) {
    return `${name} ${operator || '='} ${numQuery}`
  }

  // Since userID and recordID must be numbers, we check if query is number to avoid wrong queries
  if (['DateTime'].includes(kind)) {
    const date = moment(query)
    if (date.isValid()) {
      return `DATE(${name}) ${operator || '='} DATE('${date.format('YYYY-MM-DD')}')`
    }
  }

  // Since userID and recordID must be numbers, we check if query is number to avoid wrong queries
  if (['User', 'Record'].includes(kind) && !isNaN(numQuery) && operator) {
    return `${name} ${operator} '${query}'`
  }

  if (['String', 'Url', 'Select', 'Email'].includes(kind)) {
    if (operator === 'LIKE' || !operator) {
      return `${name} LIKE '%${strQuery}%'`
    } else if (operator === '!=') {
      return `(${name} ${operator} '${strQuery}' OR ${name} is null)`
    } else {
      return `${name} ${operator} '${strQuery}'`
    }
  }
}

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

// Takes fields and prefilter and record list filter and merges them into query string
// ie: Return records that have strings in columns (fields) we're showing that start with <query> in case
//     of text or are exactly the same in case of numbers
export function queryToFilter (searchQuery = '', prefilter = '', fields = [], recordListFilter = []) {
  searchQuery = (searchQuery || '').trim()

  // Create query for search string
  if (searchQuery) {
    searchQuery = fields
      .map(qf => getFieldFilter(qf.name, qf.kind, searchQuery))
      .filter(q => !!q)
      .join(' OR ')

    searchQuery = `(${searchQuery})`
  }

  const recordListFilterSqlArray = recordListFilter.map(({ groupCondition, filter = [] }) => {
    groupCondition = groupCondition ? ` ${groupCondition} ` : ''
    filter = getRecordListFilterSql(filter)

    return filter ? `${filter}${groupCondition}` : ''
  }).filter(filter => filter)

  // Trim AND/OR from end of string
  let recordListFilterSql = trimChar(trimChar(recordListFilterSqlArray.join(''), ' AND '), ' OR ')

  // If filter exists, wrap with ()
  recordListFilterSql = recordListFilterSqlArray.length > 1 ? `(${recordListFilterSql})` : recordListFilterSql

  return [prefilter, searchQuery, recordListFilterSql].filter(f => f).join(' AND ')
}

// Evaluates the given prefilter. Allows JS template literal expressions
// such as id = ${recordID}
export function evaluatePrefilter (prefilter, { record, recordID, ownerID, userID }) {
  return (function (prefilter) {
    /* eslint-disable no-eval */
    return eval('`' + prefilter + '`')
  })(prefilter)
}

// Removes char from end of string
function trimChar (text = '', char = '') {
  if (text.substring(text.length - char.length, text.length) === char) {
    text = text.substring(0, text.length - char.length)
  }
  return text
}

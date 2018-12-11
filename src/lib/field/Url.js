// @todo option to allow multiple entries
// @todo option to allow duplicates
export class Url {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ trimFragment, trimQuery, trimPath, onlySecure, outputPlain } = {}) {
    this.trimFragment = !!trimFragment
    this.trimQuery = !!trimQuery
    this.trimPath = !!trimPath
    this.onlySecure = !!onlySecure
    this.outputPlain = !!outputPlain

    return this
  }
}

export function trimUrlFragment (url) {
  return url.split('#')[0]
}

export function trimUrlQuery (url) {
  return url.split('?')[0]
}

export function trimUrlPath (url) {
  var urlComponents = url.split('/')

  return urlComponents[0] + '//' + urlComponents[2]
}

export function onlySecureUrl (url) {
  if (url.charAt(4).toLowerCase() === 's') {
    return url
  }

  return url.slice(0, 4) + 's' + url.slice(4)
}

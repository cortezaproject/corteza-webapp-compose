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

  export () {
    return {
      trimFragment: this.trimFragment,
      trimQuery: this.trimQuery,
      trimPath: this.trimPath,
      onlySecure: this.onlySecure,
      outputPlain: this.outputPlain,
    }
  }
}

export function trimUrlFragment (url) {
  if (url && url.length > 4) {
    return url.split('#')[0]
  }
  return url
}

export function trimUrlQuery (url) {
  if (url && url.length > 4) {
    return url.split('?')[0]
  }
  return url
}

export function trimUrlPath (url) {
  if (url && url.length > 4) {
    var urlComponents = url.split('/')

    return urlComponents[0] + '//' + urlComponents[2]
  }
  return url
}

export function onlySecureUrl (url) {
  if (url && url.length > 4) {
    if (url.charAt(4).toLowerCase() === 's') {
      return url
    }

    return url.slice(0, 4) + 's' + url.slice(4)
  }
  return url
}

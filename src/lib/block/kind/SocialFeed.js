import BlockOptionsInterface from './BlockOptionsInterface'

export class SocialFeed extends BlockOptionsInterface {
  constructor (def = {}) {
    super()
    this.merge(def)
  }

  merge (def = {}) {
    // @todo
  }
}

export function getTwitterHandle (url) {
  var twitterUnpacked = url.split('/')
  // the fourth item should be the handle
  if (twitterUnpacked.length === 4) {
    return twitterUnpacked[3]
  } else {
    // something strange with this twitter url
    return ''
  }
}

export function extractSocialUrl (o) {
  var url = ''
  var socialNetwork = ''
  var twitterHandle = ''
  // check if we have a profileSourceField
  if (o.profileSourceField && o.profileSourceField.length > 0) {
    url = o.profileSourceField
  } else {
    // see if we can fail back to profileUrl
    if (o.profileUrl && o.profileUrl.length > 0) {
      url = o.profileUrl
    }
  }

  // is this a twitter url?
  if (url.indexOf('twitter.com')) {
    twitterHandle = getTwitterHandle(url)
    if (twitterHandle === '') {
      // failed to get twitter handle from the url
      twitterHandle = ''
      socialNetwork = ''
    } else {
      socialNetwork = 'Twitter'
    }
  } else {
    // this was not a twitter url
    url = ''
    socialNetwork = ''
  }

  return {
    url,
    socialNetwork,
    twitterHandle,
  }
}

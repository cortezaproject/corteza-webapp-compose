export class SocialFeed {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ moduleID, fields, profileSourceField, profileUrl } = {}) {
    this.moduleID = moduleID || undefined
    this.fields = fields || []
    this.profileSourceField = profileSourceField || undefined
    this.profileUrl = profileUrl || undefined
    return this
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

export function extractSocialUrl (profileSourceField, profileUrl, record = null) {
  var url = ''
  var socialNetwork = ''
  var twitterHandle = ''
  // check if we have a profileSourceField
  if (profileSourceField && profileSourceField.length > 0) {
    url = (record.fields.find(f => f.name === profileSourceField) || {}).value
  } else {
    // see if we can fail back to profileUrl
    if (profileUrl && profileUrl.length > 0) {
      url = profileUrl
    }
  }

  // is this a twitter url?
  if (url && url.indexOf('twitter.com')) {
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

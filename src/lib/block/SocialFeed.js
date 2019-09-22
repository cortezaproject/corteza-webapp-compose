import { PropCast, ID } from 'corteza-webapp-common/src/lib/types/common'

export class SocialFeed {
  constructor (o = {}) {
    this.moduleID = PropCast(ID, o.moduleID)
    this.fields = o.fields || []
    this.profileSourceField = PropCast(String, o.profileSourceField)
    this.profileUrl = PropCast(String, o.profileUrl)
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
  if (profileSourceField && profileSourceField.length > 0 && record) {
    url = record.values[profileSourceField]
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

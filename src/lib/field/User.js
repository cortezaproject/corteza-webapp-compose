// @todo option to allow multiple entries
// @todo option to allow duplicates
export class User {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ presetWithAuthenticated } = {}) {
    this.presetWithAuthenticated = this.presetWithAuthenticated || !!presetWithAuthenticated
    return this
  }

  formatter ({ userID, name, username, email } = {}) {
    return name || username || email || userID
  }

  export () {
    return {
      presetWithAuthenticated: this.presetWithAuthenticated,
    }
  }
}

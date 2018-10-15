export default class SharedService {
  static generateUniqID () {
    return '_' + Math.random().toString(36).substr(2, 9)
  }

  static cloneObject (object) {
    return JSON.parse(JSON.stringify(object))
  }
}

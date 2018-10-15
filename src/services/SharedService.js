export default class SharedService {
  generateUniqID () {
    return '_' + Math.random().toString(36).substr(2, 9)
  }

  cloneObject (object) {
    return JSON.parse(JSON.stringify(object))
  }
}

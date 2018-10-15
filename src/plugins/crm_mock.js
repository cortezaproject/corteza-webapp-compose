class MockCRM {
  async pageList () {
    return new Promise((resolve, reject) => {
      try {
        const result = require(`../api/mock/json-page-list.json`)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  async pageCreate (name) {
    alert('TODO API : pageCreate(' + name + ')')
    return { name, id: Math.random() }
  }

  async pageRead (id) {
    alert('TODO API : pageRead(' + id + ')')
    return new Promise((resolve, reject) => {
      try {
        const result = require(`../api/mock/json-page-get.json`)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  async pageEdit (id, name) {
    alert('TODO API : pageEdit(' + id + ',' + name + ')')
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => resolve(true), 1000)
      } catch (error) {
        reject(error)
      }
    })
  }

  async pageDelete (id) {
    alert('TODO API : pageDelete(' + id + ')')
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => resolve(true), 1000)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default MockCRM

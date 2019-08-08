class SystemAPI {
  async userList () {
    return {
      query: '',
      set: [
        {
          createdAt: '2018-10-29T14:23:47Z',
          email: 'demoUser@mail.com',
          handle: '',
          kind: '',
          meta: {},
          name: 'Demo user 1',
          organisationID: '0',
          relatedUserID: '0',
          updatedAt: '2019-01-24T09:52:57Z',
          user: null,
          userID: '1',
          username: '',
        },
        {
          createdAt: '2018-10-29T14:23:47Z',
          email: 'demoUser2@mail.com',
          handle: '',
          kind: '',
          meta: {},
          name: 'Demo user 2',
          organisationID: '0',
          relatedUserID: '0',
          updatedAt: '2019-01-24T09:52:57Z',
          user: null,
          userID: '2',
          username: '',
        },
        {
          createdAt: '2018-10-29T14:23:47Z',
          email: 'demoUser3@mail.com',
          handle: '',
          kind: '',
          meta: {},
          name: 'Demo user 3',
          organisationID: '0',
          relatedUserID: '0',
          updatedAt: '2019-01-24T09:52:57Z',
          user: null,
          userID: '3',
          username: '',
        },
      ],
    }
  }
}

export default new SystemAPI()

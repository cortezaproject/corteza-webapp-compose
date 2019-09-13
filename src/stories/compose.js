class ComposeAPI {
  constructor () {
    this.records = [
      {
        moduleID: '1',
        recordID: '1',
        values: {
          RecordLabel: 'Record label 1',
          Name: 'Test name 1',
        },
      },
      {
        moduleID: '1',
        recordID: '2',
        values: {
          RecordLabel: 'Record label 2',
          Name: '',
        },
      },
    ]
  }

  async attachmentRead () {
    return {
      attachmentID: '104123496589688841',
      name: 'Test file',
      namespaceID: '88714882739863655',
      createdAt: '2019-0812T1:3: 44Z',
      meta: {
        original: {
          size: 29541,
          ext: 'png',
          mimetype: 'image/png',
          image: {
            width: 760,
            height: 131,
            animated: false,
          },
        },
        preview: {
          size: 5191,
          ext: 'jpg',
          mimetype: 'image/jpeg',
          image: {
            width: 320,
            height: 55,
            animated: false,
          },
        },
      },
    }
  }

  recordUploadEndpoint () {
    return ''
  }

  async recordList (args = {}) {
    const { filter } = args
    let records = this.records
    if (filter === 'Name') {
      records = records.filter(r => r.values.Name)
    } else if (filter === 'Name IS NULL') {
      records = records.filter(r => !r.values.Name)
    }
    return {
      query: '',
      set: records,
    }
  }

  async recordRead () {
    return {
      moduleID: '1',
      recordID: '1',
      values: {
        RecordLabel: [
          'Record label 1',
        ],
        Name: 'Test name 1',
      },
    }
  }

  async recordUpdate (args = {}) {
    const { recordID, values } = args
    this.records.map(r => {
      if (r.recordID === recordID) {
        r.values = values
      }
    })
  }

  async moduleList () {
    return {
      set: [
        {
          namespaceID: '1',
          moduleID: '1',
          canCreateRecord: true,
          canDeleteModule: true,
          canDeleteRecord: true,
          canGrant: true,
          canManageAutomationTriggers: true,
          canReadRecord: true,
          canUpdateModule: true,
          canUpdateRecord: true,
          fields: [
            {
              canReadRecordValue: true,
              canUpdateRecordValue: true,
              name: 'LeadId',
              label: 'Lead',
              isMulti: true,
              kind: 'Record',
              options: {
                moduleID: '1',
                labelField: 'RecordLabel',
                queryFields: [
                  'RecordLabel',
                ],
                selectType: 'default',
                multiDelimiter: '\n',
              },
            },
            {
              canReadRecordValue: true,
              canUpdateRecordValue: true,
              name: 'Name',
              label: 'Name',
              isMulti: false,
              kind: 'String',
            },
            {
              canReadRecordValue: true,
              canUpdateRecordValue: true,
              name: 'RecordLabel',
              label: 'RecordLabel',
              isMulti: false,
              kind: 'String',
            },
          ],
        },
      ],
    }
  }

  async moduleRead () {
    return {
      moduleID: '1',
      fields: [
        {
          name: 'LeadId',
          label: 'Lead',
          isMulti: true,
          kind: 'Record',
          options: {
            moduleID: '1',
            labelField: 'RecordLabel',
            queryFields: [
              'RecordLabel',
            ],
            selectType: 'default',
            multiDelimiter: '\n',
          },
        },
      ],
    }
  }
}

export default new ComposeAPI()

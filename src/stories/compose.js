class ComposeAPI {
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

  async recordList () {
    return {
      query: '',
      set: [
        {
          moduleID: '1',
          recordID: '1',
          values: {
            RecordLabel: [
              'Record label 1',
            ],
          },
        },
        {
          moduleID: '1',
          recordID: '2',
          values: {
            RecordLabel: [
              'Record label 2',
            ],
          },
        },
      ],
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
      },
    }
  }

  async moduleList () {
    return [
      {
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
      },
    ]
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

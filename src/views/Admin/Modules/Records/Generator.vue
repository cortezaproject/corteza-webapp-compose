<template>
  <b-container>
    <b-row>
      <b-col md="12">
        <b-card v-if="!faker">{{ $t('module.recordGenerator.notUsable') }}>
        </b-card>
        <b-card>
          <h4>{{ $t('module.recordGenerator.forModule') }} {{module.name}}</h4>
          <b-form @submit.prevent="handleGenerate">
            <b-input-group :prepend="$t('module.recordGenerator.howManyRecords')">
              <b-form-input
                type="number"
                required
                :disabled="disabled"
                v-model="totalRecordsToCreate" variant="primary" />
              <b-input-group-append>
                <b-button type="submit"
                          :disabled="disabled">{{ $t('module.recordGenerator.generate') }}</b-button>
              </b-input-group-append>
            </b-input-group>
            <b-progress height="20px" class="mt-2" :max="parseInt(totalRecordsToCreate)" show-progress>
              <b-progress-bar :value="recordsCreated/parseInt(totalRecordsToCreate)*100" variant="success"></b-progress-bar>
            </b-progress>
          </b-form>
          <hr />
          <h4>
            <i18next path="module.recordGenerator.sampleRoll" tag="label">
              <b-button @click="demo=recordFaker()" variant="dark">
                {{ $t('module.recordGenerator.rollTheDice') }}
              </b-button>
            </i18next>
          </h4>
          <table border="1">
            <tr v-for="(v,i) in demo" :key="i">
              <td width="150">{{ v.name }}</td>
              <th>{{ v.value }}</th>
            </tr>
          </table>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'

export default {
  props: {
    namespace: {
      type: Namespace,
      required: true,
    },

    moduleID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      faker: null,

      demo: [],
      disabled: false,
      totalRecordsToCreate: 10,
      recordsCreated: 0,
    }
  },

  computed: {
    module () {
      return this.$store.getters['module/getByID'](this.moduleID)
    },
  },

  created () {
    try {
      this.faker = require('faker')
      // Check for faker lib and fail softly
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  },

  methods: {
    async handleGenerate () {
      const { namespaceID } = this.namespace
      this.disabled = true
      for (this.recordsCreated = 0; this.recordsCreated < this.totalRecordsToCreate; this.recordsCreated++) {
        await this.$ComposeAPI.recordCreate({ namespaceID, fields: this.recordFaker(), moduleID: this.moduleID })
      }
      this.disabled = false
    },

    recordFaker () {
      return this.module.fields.filter(f => !!f.name).map((f) => {
        return {
          name: f.name,
          value: this.valueFaker(f),
        }
      })
    },

    valueFaker (f) {
      const strNamedLike = (re) => f.kind === 'String' && re.test(f.name)

      switch (true) {
        case strNamedLike(/^company(.*name)?$/i):
          return `${this.faker.company.companyName()} ${this.faker.company.companySuffix()}`
        case strNamedLike(/^(first|family)(.*name)|name?$/i):
          return this.faker.name.firstName()
        case strNamedLike(/^(last|family)(.*name)?$/i):
          return this.faker.name.lastName()
        case strNamedLike(/phone|fax|gsm|mobile|cell/i):
          return this.faker.phone.phoneNumber()
        case strNamedLike(/description/i):
          return this.faker.lorem.paragraphs()
        case strNamedLike(/country/i):
          return this.faker.address.country()
        case strNamedLike(/city/i):
          return this.faker.address.city()
        case strNamedLike(/street/i):
          return this.faker.address.streetAddress()
        case strNamedLike(/zip|postal/i):
          return this.faker.address.zipCode()
        case strNamedLike(/.+/i):
          return this.faker.lorem.words()

        case f.kind === 'Email':
          return this.faker.internet.email()
        case f.kind === 'Url':
          return this.faker.internet.url()

        case f.kind === 'Select':
          return f.options.options[Math.floor(Math.random() * f.options.options.length)]
        case f.kind === 'Number':
          return (Math.round(Math.random() * 100000) / 100).toString()
        case f.kind === 'DateTime':
          return this.faker.date.past(5).toISOString()
      }
    },
  },
}
</script>

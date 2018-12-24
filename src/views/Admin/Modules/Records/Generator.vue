<template>
  <div>
    <section v-if="!faker">Can not use generator, no faker lib.</section>
    <section class="container well" v-else-if="module">
      <h2>Record generator for {{module.name}}</h2>

      <form @submit.prevent="handleGenerate">
        <b-input-group prepend=" How many fake ecords do you want to create?">
          <b-form-input
            type="number"
            required
            :disabled="disabled"
            v-model="totalRecordsToCreate" variant="primary" />
          <b-input-group-append>
            <b-button type="submit"
                      :disabled="disabled">Generate!</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-progress height="20px" class="mt-2" :max="parseInt(totalRecordsToCreate)" show-progress>
          <b-progress-bar :value="recordsCreated/parseInt(totalRecordsToCreate)*100" variant="success"></b-progress-bar>
        </b-progress>
        <router-link :to="{name: 'admin.modules.records'}" class="btn-url">List of records</router-link>
      </form>

      <hr />
      <h3>Sample <button @click="demo=recordFaker()">roll the dice</button></h3>
      <table border="1">
        <tr v-for="(v,i) in demo" :key="i">
          <td width="150">{{ v.name }}</td>
          <th>{{ v.value }}</th>
        </tr>
      </table>
    </section>
  </div>
</template>

<script>
import FieldEditor from '@/lib/field/Editor'
import Module from '@/lib/module'

export default {
  props: {
    moduleID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      module: null,
      faker: null,

      demo: [],
      disabled: false,
      totalRecordsToCreate: 10,
      recordsCreated: 0,
    }
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

  mounted () {
    this.$crm.moduleRead({ moduleID: this.moduleID }).then(m => {
      this.module = new Module(m)
      this.demo = this.recordFaker()
    }).catch(this.defaultErrorHandler('Could not load module'))
  },

  methods: {
    async handleGenerate () {
      this.disabled = true
      for (this.recordsCreated = 0; this.recordsCreated < this.totalRecordsToCreate; this.recordsCreated++) {
        await this.$crm.moduleRecordCreate({ fields: this.recordFaker(), moduleID: this.moduleID })
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

  components: {
    FieldEditor,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

table {
  td {
    vertical-align: middle;
  }
}

.well {
  margin-bottom: 80px;
}

.alert {
  position: absolute;
  z-index: 1;
  width: 100%;
  box-shadow: 0 0 2px 0 rgba($appgrey, 0.75);
}
</style>

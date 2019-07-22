<template>
  <b-form-group :label="field.label || field.name">
    <multi v-if="field.isMulti" :value.sync="value" :singleInput="field.options.selectType !== 'each'">
      <template v-slot:single>
        <vue-select v-if="field.options.selectType === 'default'"
                    :options="options"
                    :disabled="!module"
                    @search="search"
                    option-value="recordID"
                    option-text="label"
                    :placeholder="$t('field.kind.record.suggestionPlaceholder')"
                    @input="selectChange($event)"
                    ref="singleSelect">
        </vue-select>
        <vue-select v-else-if="field.options.selectType === 'multiple'"
                    :options="options"
                    :disabled="!module"
                    @search="search"
                    option-value="recordID"
                    option-text="label"
                    :placeholder="$t('field.kind.record.suggestionPlaceholder')"
                    multiple
                    v-model="multipleSelected">
        </vue-select>
      </template>
      <template v-slot:default="ctx">
        <vue-select v-if="field.options.selectType === 'each'"
                    :options="options"
                    :disabled="!module"
                    @search="search"
                    option-value="recordID"
                    option-text="label"
                    :placeholder="$t('field.kind.record.suggestionPlaceholder')"
                    :value="getRecord(ctx.index)"
                    @input="setRecord($event, ctx.index)">
        </vue-select>
        <span v-else>{{ (multipleSelected[ctx.index] || {}).label }}</span>
      </template>
    </multi>

    <vue-select v-else
                :options="options"
                :disabled="!module"
                @search="search"
                option-value="recordID"
                option-text="label"
                :placeholder="$t('field.kind.record.suggestionPlaceholder')"
                v-model="selected">

      <b-form-text v-if="validate && errors">
        <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
      </b-form-text>
    </vue-select>
  </b-form-group>
</template>
<script>
import base from './base'
import { VueSelect } from 'vue-select'
import Record from 'corteza-webapp-compose/src/lib/record'
import _ from 'lodash'

export default {
  components: {
    VueSelect,
  },

  extends: base,

  data () {
    return {
      valueRecord: {},
      records: [],
      latest: [], // set of 20 latest records for default list
      query: null,
    }
  },

  computed: {
    options () {
      return (this.query ? this.records : this.latest).map(this.convert)
    },

    module () {
      if (this.field.options.moduleID !== '0') {
        return this.$store.getters['module/getByID'](this.field.options.moduleID)
      } else {
        return undefined
      }
    },

    multipleSelected: {
      get () {
        return this.value.map(v => this.convert(this.latest.find(r => r.recordID === v)))
      },

      set (value) {
        if (value.length !== this.value.length) {
          this.value = value.map(v => v.value)
        }
      },
    },

    selected: {
      get () {
        return this.getRecord()
      },

      set (value) {
        this.setRecord(value)
      },
    },
  },

  watch: {
    'field.options': {
      deep: true,
      handler () {
        // We need to daly loading for abit
        _.throttle((e) => {
          this.loadLatest()
        }, 500)()
      },
    },
  },

  created () {
    this.loadLatest()
  },

  methods: {
    getRecord (index = undefined) {
      const value = index !== undefined ? this.value[index] : this.value
      if (value) {
        return this.convert(this.latest.find(r => r.recordID === value))
      }
    },

    setRecord (event, index = undefined) {
      const crtValue = index !== undefined ? this.value[index] : this.value
      let trueValue = ''
      let { value } = event || {}
      if (value && value !== crtValue) {
        // Set selected to value
        trueValue = value
      }

      if (index !== undefined) {
        this.value[index] = trueValue
      } else {
        this.value = trueValue
        // Find selected and copy it to so we can show it
        this.valueRecord = this.records.find(r => r.recordID === trueValue)
      }
    },

    convert (r) {
      if (!r || !r.values) {
        return null
      }
      const value = r.recordID
      let label = value
      if (this.field.options.labelField) {
        label = r.values[this.field.options.labelField]
      }

      return { value, label }
    },

    search (query) {
      this.query = query
      const namespaceID = this.namespace.namespaceID
      const moduleID = this.field.options.moduleID

      if (moduleID && query.length > 0) {
        // Prepare query
        const filter = (this.field.options.queryFields || [this.field.options.labelField]).map(qf => {
          return `${qf} LIKE '%${query}%'`
        }).join(' OR ')

        this.$ComposeAPI.recordList({ namespaceID, moduleID, filter, sort: this.sortString() }).then(({ set }) => {
          this.records = set.map(r => new Record(this.module, r))
        })
      }
    },

    loadLatest () {
      const namespaceID = this.namespace.namespaceID
      const moduleID = this.field.options.moduleID
      if (moduleID) {
        this.$ComposeAPI.recordList({ namespaceID, moduleID, sort: this.sortString() }).then(({ set }) => {
          this.latest = set.map(r => new Record(this.module, r))
        })
      }
    },

    sortString () {
      return [this.field.options.labelField, 'updated_at DESC', 'created_at DESC'].filter(f => !!f).join(', ')
    },

    // Fetches record if not already present
    findByID (recordID) {
      if (recordID) {
        if ((this.valueRecord || {}).recordID !== recordID) {
          let r = this.latest.find(record => record.recordID === recordID)
          this.valueRecord = new Record(this.module, r)
          return this.valueRecord
        } else {
          return this.valueRecord
        }
      }
    },

    selectChange (event) {
      this.value.push(event.value)
      // Cant mutate props so we use magic(refs)
      this.$refs.singleSelect.mutableValue = null
    },
  },
}
</script>

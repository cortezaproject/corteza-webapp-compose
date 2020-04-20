<template>
  <b-form-group :label="label">
    <multi v-if="field.isMulti" :value.sync="value" :singleInput="field.options.selectType !== 'each'" :removable="field.options.selectType !== 'multiple'">
      <template v-slot:single>
        <vue-select v-if="field.options.selectType === 'default'"
                    :filterable="false"
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
                    :filterable="false"
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
                    :filterable="false"
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
                :filterable="false"
                :options="options"
                :disabled="!module"
                @search="search"
                option-value="recordID"
                option-text="label"
                :placeholder="$t('field.kind.record.suggestionPlaceholder')"
                v-model="selected"></vue-select>

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
</template>
<script>
import base from './base'
import { VueSelect } from 'vue-select'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  components: {
    VueSelect,
  },

  extends: base,

  data () {
    return {
      fetchedRecords: [],
      records: [],
      latest: [], // set of 10 latest records for default list
      query: null,
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    options () {
      return (this.query ? this.records : this.latest).map(this.convert).filter(v => v)
    },

    module () {
      if (this.field.options.moduleID !== '0') {
        return this.getModuleByID(this.field.options.moduleID)
      } else {
        return undefined
      }
    },

    multipleSelected: {
      get () {
        return this.value
          .map(v => this.convert(this.fetchedRecords.find(r => r.recordID === v)))
          .filter(e => e)
      },

      set (value) {
        if (value.length !== this.value.length) {
          this.value = value.map(({ value }) => {
            if (!this.value.includes(value)) {
              this.fetchRecord(value)
            }
            return value
          })
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
        // Delay loading of referenced records for a bit
        _.throttle((e) => {
          this.loadLatest()
        }, 500)()
      },
    },
  },

  created () {
    this.loadLatest()
    const value = this.field.isMulti ? this.value : [this.value]
    if (value) {
      const { moduleID } = this.field.options
      if (moduleID) {
        for (let v of value) {
          if (v) {
            this.fetchRecord(v)
          }
        }
      }
    }
  },

  methods: {
    getRecord (index = undefined) {
      const value = index !== undefined ? this.value[index] : this.value
      if (value) {
        return this.convert(this.fetchedRecords.find(r => r.recordID === value))
      }
    },

    setRecord (event, index = undefined) {
      const crtValue = index !== undefined ? this.value[index] : this.value
      let { value } = event || {}
      if (value && value !== crtValue) {
        // Set selected to value
        this.fetchRecord(value)
        if (index !== undefined) {
          this.value[index] = value
        } else {
          this.value = value
        }
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
        if (label && label.length > 0) {
          if (Array.isArray(label)) {
            label = label.join(', ')
          }

          return { value, label }
        }
      }
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
      const perPage = 10
      if (moduleID) {
        this.$ComposeAPI.recordList({ namespaceID, moduleID, perPage }).then(({ set }) => {
          this.latest = set.map(r => new Record(this.module, r))
        })
      }
    },

    sortString () {
      return [this.field.options.labelField, 'updated_at DESC', 'created_at DESC'].filter(f => !!f).join(', ')
    },

    fetchRecord (recordID) {
      const namespaceID = this.namespace.namespaceID
      const moduleID = this.field.options.moduleID
      if (!this.fetchedRecords.find(r => r.recordID === recordID)) {
        this.$ComposeAPI.recordRead({ namespaceID, moduleID, recordID }).then(record => {
          this.fetchedRecords.push(new Record(this.module, record))
        }).catch(e => {
          this.fetchedRecords.push(new Record(this.module, { recordID }))
        })
      }
    },

    selectChange (event) {
      const { value } = event || {}
      if (value) {
        this.fetchRecord(value)
        this.value.push(value)
        // Cant mutate props so we use magic(refs)
        this.$refs.singleSelect.mutableValue = null
      }
    },
  },
}
</script>

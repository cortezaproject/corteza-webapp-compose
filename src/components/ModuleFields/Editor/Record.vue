<template>
  <b-form-group
    label-class="text-primary"
    :class="formGroupStyleClasses"
  >
    <template #label>
      <div
        v-if="!valueOnly"
        class="d-flex align-items-top"
      >
        <label
          class="mb-0"
        >
          {{ label }}
        </label>

        <hint
          :text="hint"
          :id="field.fieldID"
        />
      </div>
      <small
        class="form-text font-weight-light text-muted"
      >
        {{ description }}
      </small>
    </template>

    <multi v-if="field.isMulti" :value.sync="value" :singleInput="field.options.selectType !== 'each'" :removable="field.options.selectType !== 'multiple'">
      <template v-slot:single>
        <vue-select
          v-if="field.options.selectType === 'multiple'"
          v-model="multipleSelected"
          :options="options"
          :disabled="!module"
          :loading="processing"
          option-value="recordID"
          option-text="label"
          :append-to-body="inlineEditor"
          :calculate-position="calculatePosition"
          :clearable="false"
          :filterable="false"
          class="bg-white"
          :placeholder="$t('field.kind.record.suggestionPlaceholder')"
          multiple
          @open="onOpen"
          @search="search"
        >
          <pagination
            v-if="showPagination"
            slot="list-footer"
            :has-prev-page="hasPrevPage"
            :has-next-page="hasNextPage"
            @prev="goToNextPage(false)"
            @next="goToNextPage(true)"
          />
        </vue-select>
        <vue-select
          v-else
          ref="singleSelect"
          :options="options"
          :disabled="!module"
          :loading="processing"
          option-value="recordID"
          option-text="label"
          :append-to-body="inlineEditor"
          :calculate-position="calculatePosition"
          :clearable="false"
          :filterable="false"
          class="bg-white"
          :placeholder="$t('field.kind.record.suggestionPlaceholder')"
          @input="selectChange($event)"
          @open="onOpen"
          @search="search"
        >
          <pagination
            v-if="showPagination"
            slot="list-footer"
            :has-prev-page="hasPrevPage"
            :has-next-page="hasNextPage"
            @prev="goToNextPage(false)"
            @next="goToNextPage(true)"
          />
        </vue-select>
      </template>
      <template v-slot:default="ctx">
        <vue-select
          v-if="field.options.selectType === 'each'"
          :options="options"
          :disabled="!module"
          :loading="processing"
          option-value="recordID"
          option-text="label"
          :append-to-body="inlineEditor"
          :calculate-position="calculatePosition"
          :clearable="false"
          :filterable="false"
          class="bg-white"
          :placeholder="$t('field.kind.record.suggestionPlaceholder')"
          :value="getRecord(ctx.index)"
          @open="onOpen"
          @input="setRecord($event, ctx.index)"
          @search="search"
        >
          <pagination
            v-if="showPagination"
            slot="list-footer"
            :has-prev-page="hasPrevPage"
            :has-next-page="hasNextPage"
            @prev="goToNextPage(false)"
            @next="goToNextPage(true)"
          />
        </vue-select>
        <span v-else>{{ (multipleSelected[ctx.index] || {}).label }}</span>
        <errors :errors="errors" />
      </template>
    </multi>
    <template
      v-else
    >
      <vue-select
        :options="options"
        :disabled="!module"
        :loading="processing"
        option-value="recordID"
        option-text="label"
        :append-to-body="inlineEditor"
        :calculate-position="calculatePosition"
        :placeholder="$t('field.kind.record.suggestionPlaceholder')"
        :filterable="false"
        class="bg-white"
        v-model="selected"
        @open="onOpen"
        @search="search"
      >
        <pagination
          v-if="showPagination"
          slot="list-footer"
          :has-prev-page="hasPrevPage"
          :has-next-page="hasNextPage"
          @prev="goToNextPage(false)"
          @next="goToNextPage(true)"
        />
      </vue-select>
      <errors :errors="errors" />
    </template>
  </b-form-group>
</template>
<script>
import base from './base'
import { VueSelect } from 'vue-select'
import { compose, NoID } from '@cortezaproject/corteza-js'
import { debounce } from 'lodash'
import { createPopper } from '@popperjs/core'
import { mapGetters } from 'vuex'
import { evaluatePrefilter } from 'corteza-webapp-compose/src/lib/record-filter'
import Pagination from '../Common/Pagination.vue'

export default {
  components: {
    VueSelect,
    Pagination,
  },

  extends: base,

  data () {
    return {
      processing: false,

      query: '',

      fetchedRecords: [],
      records: [],
      latest: [], // set of 10 latest records for default list

      filter: {
        query: '',
        sort: '',
        limit: 10,
        pageCursor: '',
        prevPage: '',
        nextPage: '',
      },
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

    showPagination () {
      return this.hasPrevPage || this.hasNextPage
    },

    hasPrevPage () {
      return !!this.filter.prevPage
    },

    hasNextPage () {
      return !!this.filter.nextPage
    },
  },

  watch: {
    'filter.pageCursor': {
      handler (pageCursor) {
        if (pageCursor && this.filter.query) {
          this.fetchPrefiltered(this.filter)
            .then(({ filter, set }) => {
              this.records = set.map(r => new compose.Record(this.module, r))
            })
        }
      },
    },
  },

  created () {
    this.loadLatest()
    const value = this.field.isMulti ? this.value : [this.value]
    if (value) {
      const { moduleID } = this.field.options
      if (moduleID) {
        for (const v of value) {
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
      const { value } = event || {}
      if (value !== crtValue) {
        if (value) {
          // Set selected to value
          this.fetchRecord(value)
          if (index !== undefined) {
            this.value[index] = value
          } else {
            this.value = value
          }
        } else {
          if (index !== undefined) {
            this.value.splice(index, 1)
          } else {
            this.value = undefined
          }
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

    search: debounce(function (query) {
      if (query !== this.query) {
        this.query = query
        this.filter.pageCursor = undefined
      }

      const { limit, pageCursor } = this.filter
      const namespaceID = this.namespace.namespaceID
      const moduleID = this.field.options.moduleID

      if (moduleID && moduleID !== NoID && query.length > 0) {
        // Determine what fields to use for searching
        // Default to label field
        let qf = this.field.options.queryFields
        if (!qf || qf.length === 0) {
          qf = [this.field.options.labelField]
        }

        // Construct query
        query = qf.map(qf => {
          return `${qf} LIKE '%${query}%'`
        }).join(' OR ')

        this.fetchPrefiltered({ namespaceID, moduleID, query, sort: this.sortString(), limit, pageCursor })
          .then(({ filter, set }) => {
            this.records = set.map(r => new compose.Record(this.module, r))
          })
      }
    }, 300),

    loadLatest () {
      const namespaceID = this.namespace.namespaceID
      const moduleID = this.field.options.moduleID
      const { limit } = this.filter
      if (moduleID && moduleID !== NoID) {
        this.fetchPrefiltered({ namespaceID, moduleID, limit })
          .then(({ filter, set }) => {
            this.latest = set.map(r => new compose.Record(this.module, r))
          })
      }
    },

    async fetchPrefiltered (q) {
      this.processing = true

      // Support prefilters
      let { query = '' } = q
      if (this.field.options.prefilter) {
        const pf = evaluatePrefilter(this.field.options.prefilter, {
          record: this.record,
          recordID: (this.record || {}).recordID || NoID,
          ownerID: (this.record || {}).userID || NoID,
          userID: (this.$auth.user || {}).userID || NoID,
        })
        if (query) {
          query = `(${pf}) AND (${query})`
        } else {
          query = pf
        }
      }

      if (q.pageCursor) {
        q.sort = ''
      }

      return this.$ComposeAPI.recordList({ ...q, query })
        .then(({ filter, set }) => {
          this.filter = { ...this.filter, ...filter }
          this.filter.nextPage = filter.nextPage
          this.filter.prevPage = filter.prevPage
          return { filter, set }
        })
        .finally(() => {
          this.processing = false
        })
    },

    sortString () {
      return [this.field.options.labelField].filter(f => !!f).join(', ')
    },

    fetchRecord (recordID) {
      const namespaceID = this.namespace.namespaceID
      const moduleID = this.field.options.moduleID
      if (!this.fetchedRecords.find(r => r.recordID === recordID)) {
        this.$ComposeAPI.recordRead({ namespaceID, moduleID, recordID }).then(record => {
          this.fetchedRecords.push(new compose.Record(this.module, record))
        }).catch(e => {
          this.fetchedRecords.push(new compose.Record(this.module, { recordID }))
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

    onOpen () {
      this.loadLatest()
    },

    calculatePosition (dropdownList, component, { width }) {
      /**
       * We need to explicitly define the dropdown width since
       * it is usually inherited from the parent with CSS.
       */
      dropdownList.style.width = width

      /**
       * Here we position the dropdownList relative to the $refs.toggle Element.
       *
       * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
       * the dropdownList overlap by 1 pixel.
       *
       * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
       * wrapper so that we can set some styles for when the dropdown is placed
       * above.
       */
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -1],
            },
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn ({ state }) {
              component.$el.classList.toggle('drop-up', state.placement === 'top')
            },
          }],
      })

      /**
       * To prevent memory leaks Popper needs to be destroyed.
       * If you return function, it will be called just before dropdown is removed from DOM.
       */
      return () => popper.destroy()
    },

    goToNextPage (next = true) {
      this.filter.pageCursor = next ? this.filter.nextPage : this.filter.prevPage

      this.search(this.query)
    },
  },
}
</script>

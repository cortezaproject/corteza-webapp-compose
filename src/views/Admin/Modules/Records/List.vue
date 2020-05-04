<template>
  <div class="h-100 p-2">
    <b-card
      no-body
      class="h-100 border-0 shadow-sm rounded-lg"
      :header="title"
      header-class="sticky-top h5 pl-2"
      header-bg-variant="white"
      header-text-variant="primary"
      header-border-variant="primary"
    >
      <div
        class="p-0 m-0"
      >
        <b-container
          ref="header"
          class="m-0 p-2"
          fluid
        >
          <b-row
            no-gutters
            class="m-0 p-0"
          >
            <b-col
              cols="6"
            >
              <template v-if="module.canCreateRecord">
                <router-link
                  class="btn btn-sm btn-outline-primary float-left"
                  :to="{
                    name: 'admin.modules.record.create',
                    params: { moduleID: module.moduleID },
                    query: null,
                  }"
                >
                  + {{ $t('block.recordList.addRecord') }}
                </router-link>
                <importer-modal
                  :module="module"
                  :namespace="namespace"
                  class="ml-1 float-left"
                />
              </template>
              <exporter-modal
                :module="module"
                :record-count="pagingStats.count"
                :query="query"
                :selection="selected"
                @export="onExport"
                class="ml-1 float-left"
              />
            </b-col>
            <b-col
              cols="6"
            >
              <b-input
                v-model="query"
                class="float-right mw-100"
                size="sm"
                type="search"
                style="width: 200px;"
                :placeholder="$t('general.label.search')" />

              <b-button
                variant="outline-primary"
                size="sm"
                class="float-right mr-1"
                @click="openFilterModal"
              >
                {{ $t('block.recordList.filter.label') }}
              </b-button>
            </b-col>
          </b-row>
          <b-row
            v-show="selected.length > 0"
            class="text-light bg-secondary p-2 mt-2"
          >
            <b-col
              cols="4"
              class="pt-1 text-nowrap"
            >
              {{ $t('block.recordList.selected', { count: selected.length, total: filter.count }) }}
              <a
                class="text-light"
                href="#"
                @click.prevent="handleSelectAllOnPage({ isChecked: false })"
              >
                ({{ $t('block.recordList.cancelSelection') }})
              </a>
            </b-col>
            <b-col
              class="text-right"
              cols="8"
            >
              <c-input-confirm
                @confirmed="handleDeleteSelectedRecords()"
                variant="link-light"
              />
            </b-col>
          </b-row>
        </b-container>
      </div>
      <b-card-body
        class="p-0"
      >
        <b-table
          hover
          ref="table"
          :responsive="true"
          :sticky-header="true"
          :show-empty="true"
          :small="false"
          selectable
          select-mode="multi"
          class="mh-100 m-0 mb-2 border-top"
          :items="records"
          :fields="fields"
          no-sort-reset
          @sort-changed="handleSort"
          @row-selected="handleRowSelected"
          @row-clicked="handleRowClicked"
        >
          <template #head()="{ field }">
            {{ field.label }}
          </template>
          <template #cell()="{ item: r, field }">
            <field-viewer
              v-if="true"
              :field="field.moduleField"
              value-only
              :record="r"
              :module="module"
              :namespace="namespace"
            />
            <i
              v-else
              class="text-secondary"
            >
              {{ $t('field.noPermission') }}
            </i>
          </template>
          <template #cell(actions)="{ item: r }">
            <div class="text-right">
              <b-button
                v-if="module.canCreateRecord"
                variant="link"
                class="p-0 m-0 pl-1 text-secondary"
                :to="{ name: 'admin.modules.record.create', params: { moduleID: module.moduleID, values: r.values }}"
              >
                <font-awesome-icon
                  :icon="['far', 'clone']"
                />
              </b-button>
              <b-button
                v-if="module.canUpdateRecord"
                variant="link"
                class="p-0 m-0 pl-1 text-secondary"
                :to="{ name: 'admin.modules.record.edit', params: { moduleID: module.moduleID, recordID: r.recordID }, query: null }"
              >
                <font-awesome-icon
                  :icon="['far', 'edit']"
                />
              </b-button>
              <b-button
                variant="link"
                class="p-0 m-0 pl-1 text-secondary"
                @click.prevent="handleRowClicked(r)"
              >
                <font-awesome-icon
                  :icon="['far', 'eye']"
                />
              </b-button>
            </div>
          </template>
          <template #head(selectable)>
            <b-checkbox
              :disabled="pagingStats.count === 0"
              :checked="areAllRowsSelected"
              @change="handleSelectAllOnPage({ isChecked: $event })"
            />
          </template>
          <template #cell(selectable)="{ item, index, rowSelected }">
            <b-checkbox
              :checked="rowSelected"
              @change="handleRowSelectCheckbox({ record: item, index, isChecked: $event })"
            />
          </template>
          <template #table-busy>
            <div class="text-center m-5">
              <div>
                <b-spinner
                  small
                  class="align-middle m-2"
                />
              </div>
            </div>
          </template>
        </b-table>
      </b-card-body>
      <b-card-footer
        class="p-0"
      >
        <b-container
          ref="footer"
          fluid
          class="m-0 p-2"
        >
          <b-row
            no-gutters
          >
            <b-col
              class="pt-1 text-nowrap text-truncate"
              cols="8"
            >
              <span
                v-if="filter.count > filter.perPage"
              >
                {{ $t('block.recordList.pagination', pagingStats) }}
              </span>
              <span
                v-else
              >
                {{ $t('block.recordList.paginationSingle', pagingStats) }}
              </span>
            </b-col>
            <b-col
              cols="4"
            >
              <b-pagination
                v-if="filter.count > filter.perPage"
                align="right"
                aria-controls="record-list"
                class="m-0"
                size="sm"
                v-model="filter.page"
                :per-page="filter.perPage"
                :total-rows="filter.count"
              />
            </b-col>
          </b-row>
        </b-container>
      </b-card-footer>
    </b-card>
    <b-modal
      v-model="filterFields.showModal"
      id="filterModal"
      :title="$t('block.recordList.filter.title')"
      size="xl"
      ok-only
      :ok-title="$t('block.recordList.filter.update')"
      @ok="refresh()"
    >
      <b-container class="p-0">
        <!-- @TODO This section is used for filtering deleter/undeleted records -->
        <b-form-group
          v-if="false"
          :label="$t('block.recordList.filter.deletedRecords')"
        >
          <b-form-radio-group
            v-model="filter.deleted"
            :options="[
              { value: 0, text: $t('block.recordList.filter.without') || 'excluded' },
              { value: 1, text: $t('block.recordList.filter.including') || 'inclusive' },
              { value: 2, text: $t('block.recordList.filter.only') || 'exclusive' }
            ]"
            buttons
            button-variant="outline-secondary"
            size="sm"
            name="radio-btn-outline"
          />
        </b-form-group>
        <hr v-if="false">
        <p>
          <b>
            {{ $t('block.recordList.filter.byValue') }}
          </b>
          <br>
          <i
            class="text-muted"
          >
            {{ $t('block.recordList.filter.note') }}
          </i>
        </p>
        <div
          v-for="(field, index) in filterFields.items"
          :key="`${field.name}${index}`"
        >
          <b-row>
            <b-col cols="6">
              <b-form-group
                :label="$t('block.recordList.filter.field')"
              >
                <vue-select
                  v-model="field.name"
                  :options="allModuleFields"
                  :reduce="field => field.name"
                  :disabled="!module"
                  :placeholder="$t('block.recordList.filter.fieldPlaceholder')"
                  option-text="label"
                  @input="updateFilterField(index, $event)"
                />
              </b-form-group>
            </b-col>
            <b-col
              cols="6"
              class="pl-0 pr-2"
              :class="{'pr-4': index === 0 }"
            >
              <b-form-group
                :label="$t('block.recordList.filter.fieldValue')"
              >
                <b-input-group>
                  <b-form-input
                    v-model="field.value"
                    :placeholder="$t('block.recordList.filter.fieldValuePlaceholder')"
                  />
                  <b-input-group-append
                    v-if="index > 0"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'times']"
                      @click="removeFilterField(index)"
                      class="pointer text-secondary my-auto ml-2"
                    />
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <hr class="mt-0">
        </div>
        <b-button
          variant="outline-primary"
          size="sm"
          @click="addFilterField()"
        >
          + {{ $t('block.recordList.filter.addField') }}
        </b-button>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
/*
  NOTE !
  This component duplicates the RecordListBase page block template and it's logic.
  Since the RecordListBase component is meant to be used in the Public Grid as a Block
  and this component is used in the Admin section and is not meant to be in a Grid.
  A "Render" only component cannot replace both since the Public component needs to use slots.
*/
import { throttle } from 'lodash'
import { mapGetters } from 'vuex'
import { VueSelect } from 'vue-select'
import FieldViewer from 'corteza-webapp-compose/src/components/ModuleFields/Viewer'
import ExporterModal from 'corteza-webapp-compose/src/components/Public/Record/Exporter'
import ImporterModal from 'corteza-webapp-compose/src/components/Public/Record/Importer'
import { compose } from '@cortezaproject/corteza-js'
import users from 'corteza-webapp-compose/src/mixins/users'
import { getFieldFilter, queryToFilter } from 'corteza-webapp-compose/src/lib/record-filter'
import { url } from '@cortezaproject/corteza-vue'

export default {
  components: {
    FieldViewer,
    ExporterModal,
    ImporterModal,
    VueSelect,
  },

  mixins: [
    users,
  ],

  data () {
    return {
      query: null,

      filterFields: {
        showModal: false,
        items: [
          {
            name: '',
            value: '',
            kind: '',
          },
        ],
      },

      filter: {
        deleted: 0,
        filter: '',
        sort: 'createdAt DESC',
        page: 1,
        perPage: 20,
        count: 0,
      },

      selected: [],
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    title () {
      if (this.module) {
        return `All records for module "${this.module.name}"`
      } else {
        return 'All module records'
      }
    },

    areAllRowsSelected () {
      const { count, perPage } = this.filter
      return this.selected.length === (count < perPage ? count : perPage)
    },

    pagingStats () {
      const { page, perPage, count } = this.filter
      let pages = Math.ceil(count / perPage)
      if (pages < 1) { pages = 1 }

      return {
        from: ((page - 1) * perPage) + 1,
        to: (page * perPage),
        page,
        count,
        pages,
      }
    },

    module () {
      if (this.$attrs.moduleID) {
        return this.getModuleByID(this.$attrs.moduleID)
      } else {
        return undefined
      }
    },

    namespace () {
      return this.$attrs.namespace
    },

    allModuleFields () {
      if (this.module) {
        return this.module.fields
          .filter(f => !['User', 'Record'].includes(f.kind))
          .map(f => {
            return {
              label: f.label,
              name: f.name,
              kind: f.kind,
            }
          })
      } else {
        return []
      }
    },

    fields () {
      let fields = []
      if (this.module) {
        const pre = []
        const post = []

        // Use first five fields from the module.
        fields = this.module.fields.slice(0, 5)

        pre.push({ key: 'selectable', label: '', tdClass: 'selector', thClass: 'selector' })

        const configured = fields.map(mf => ({
          key: mf.name,
          label: mf.label || mf.name,
          moduleField: mf,
          sortable: true,
          tdClass: 'record-value',
        }))

        post.push({ key: 'actions', label: '', tdClass: 'actions' })

        return [
          ...pre,
          ...configured,
          ...post,
        ]
      }
      return fields
    },
  },

  watch: {
    'filter.page' () {
      this.refresh()
    },

    query: throttle(function (e) {
      this.filter.query = queryToFilter(this.query, '', this.module.filterFields(this.module.fields.slice(0, 5)))
      this.refresh()
    }, 500),
  },

  methods: {
    openFilterModal () {
      this.filterFields.showModal = true
    },

    updateFilterField (index, name) {
      // Field must be found because of vue-select limitations
      const field = this.allModuleFields.find(f => f.name === name)
      if (field) {
        const { name, kind } = field
        this.filterFields.items[index].name = name
        this.filterFields.items[index].kind = kind
      } else {
        this.filterFields.items[index].name = ''
        this.filterFields.items[index].kind = ''
      }
    },

    updateFilterFieldValue (index, value) {
      this.filterFields.items[index].value = value
    },

    addFilterField () {
      this.filterFields.items.push({ name: '', value: '', kind: '' })
    },

    removeFilterField (index) {
      if (index > -1) {
        this.filterFields.items.splice(index, 1)
      }
    },

    onExport (e) {
      const { namespaceID, moduleID } = this.filter || {}
      const { filterRaw } = e
      e = {
        ...e,
        namespaceID,
        moduleID,
        filename: `${this.namespace.slug} - ${this.module.name}`,
      }

      if (filterRaw.rangeType === 'range') {
        e.filename += ` - ${filterRaw.date.start} - ${filterRaw.date.end}`
      } else {
        e.filename += ` - ${filterRaw.rangeType}`
      }

      if (filterRaw.includeQuery) {
        const queryF = queryToFilter(filterRaw.query, '', this.module.filterFields(this.module.fields.slice(0, 5)))
        if (e.filters) {
          e.filters = `(${e.filters}) AND `
        } else {
          e.filters = ''
        }
        if (queryF) {
          e.filters += encodeURI(`(${queryF})`)
        }
      }

      window.open(url.Make({
        url: `${this.$ComposeAPI.baseURL}${this.$ComposeAPI.recordExportEndpoint(e)}`,
        query: {
          fields: e.fields,
          filter: e.filters,
          jwt: this.$auth.JWT,
        },
      }))
    },

    handleRowClicked ({ recordID }) {
      this.$router.push({
        name: 'admin.modules.record.view',
        params: {
          moduleID: this.module.moduleID,
          recordID,
        },
        query: null,
      })
    },

    handleSort ({ sortBy, sortDesc = false }) {
      this.filter.sort = `${sortBy} ${sortDesc ? 'DESC' : ''}`.trim()
      this.refresh()
    },

    handleSelectAllOnPage ({ isChecked }) {
      if (isChecked) {
        this.$refs.table.selectAllRows()
      } else {
        this.$refs.table.clearSelected()
      }
    },

    handleRowSelectCheckbox ({ index, isChecked }) {
      if (isChecked) {
        this.$refs.table.selectRow(index)
      } else {
        this.$refs.table.unselectRow(index)
      }
    },

    handleRowSelected (selected) {
      this.selected = selected
    },

    handleDeleteSelectedRecords () {
      if (this.selected.length === 0) {
        return
      }

      const { moduleID, namespaceID } = this.selected[0]

      // Assuming all records are of same module & namespace
      const recordIDs = this.selected
        .filter(r => r.moduleID === moduleID && r.namespaceID === namespaceID)
        .map(({ recordID }) => recordID)

      this.$ComposeAPI
        .recordBulkDelete({ moduleID, namespaceID, recordIDs })
        .then(() => { this.refresh() })
        .catch(this.stdErr)
    },

    refresh () {
      this.$refs.table.refresh()
    },

    /**
     * Loader for b-table
     *
     * Will ignore b-tables input arguments for filter
     * and assemble them on our own
     */
    records () {
      let filter = queryToFilter(this.query, '', this.module.filterFields(this.module.fields.slice(0, 5)))

      const fieldsFilter = this.filterFields.items.filter(f => f.name).map(f => {
        if (f.value) {
          return `(${getFieldFilter(f, f.value)})`
        } else {
          return `(${f.name} IS NULL)`
        }
      }).join(' AND ')

      if (fieldsFilter) {
        if (filter) {
          filter = `(${filter}) AND (${fieldsFilter})`
        } else {
          filter = `${fieldsFilter}`
        }
      }

      return this.$ComposeAPI.recordList({ ...this.module, ...this.filter, filter })
        .then(({ set, filter }) => {
          const records = set.map(r => Object.freeze(new compose.Record(r, this.module)))

          this.filter = { ...this.filter, ...filter }

          // Extract user IDs from record values and load all users
          const fields = this.fields.filter(f => f.moduleField).map(f => f.moduleField)
          this.fetchUsers(fields, records)

          return records
        })
        .catch(this.stdErr)
    },

    stdErr (err) {
      /* eslint-disable no-console */
      console.error(err)
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ table {
  tbody {
    tr {
      td.record-value {
        cursor: pointer;
      }

      th.selector, td.selector {
        width: 25px !important;
      }
    }
  }
}

.pointer {
  cursor: pointer;
}
</style>

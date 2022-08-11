<template>
  <wrap
    v-bind="$props"
    :scrollable-body="true"
    v-on="$listeners"
  >
    <template
      v-if="showHeader"
      #header
    >
      <h5
        class="d-flex align-items-center text-truncate mb-0"
      >
        {{ block.title }}
      </h5>

      <b-card-text
        v-if="block.description"
        class="text-dark text-truncate mt-1"
      >
        {{ block.description }}
      </b-card-text>
    </template>
    <template
      #default
    >
      <b-alert
        v-if="!record || revisionsDisabledOnModule"
        show
        variant="warn"
      >
        {{ $t('disabled') }}
      </b-alert>
      <div
        v-else-if="!options.preload && !preloadRequested"
        class="d-flex align-items-center justify-content-center h-100"
      >
        <b-button
          @click="refresh()"
        >
          Show record revisions ({{ record.revision }}).
        </b-button>
      </div>
      <div
        v-else-if="processing"
        class="d-flex align-items-center justify-content-center h-100"
      >
        <b-spinner />
      </div>
      <b-table-lite
        v-else
        :items="revisions"
        :fields="fields"
      >
        <template #cell(timestamp)="row">
          {{ row.item.timestamp | locFullDateTime }}
        </template>
        <template
          #cell(adt)="row"
        >
          <b-button
            v-if="row.item.changes.length > 0"
            variant="link"
            class="py-0 m-0"
            @click="row.toggleDetails"
          >
            {{ row.detailsShowing ? '&times;' : `${row.item.changes.length} changes` }}
          </b-button>
        </template>
        <template #row-details="row">
          <div
            class="pl-5"
          >
            <b-table-simple
              class="bg-light"
            >
              <b-thead>
                <b-tr>
                  <b-th>Field</b-th>
                  <b-th>Old value</b-th>
                  <b-th>New value</b-th>
                </b-tr>
              </b-thead>
              <b-tbody
                v-for="(change) in row.item.changes"
                :key="change.key"
              >
                <b-tr>
                  <b-td :rowspan="change.new.length">
                    {{ change.key }}
                  </b-td>
                  <b-td>{{ change.old ? change.old[0] : '-' }}</b-td>
                  <b-td>{{ change.new ? change.new[0] : '-' }}</b-td>
                </b-tr>
                <b-tr
                  v-for="(val, index) in change.new.slice(1)"
                  :key="change.key + index"
                >
                  <b-td>{{ change.old ? change.old[index]: '-' }}</b-td>
                  <b-td>{{ change.new ? change.new[index]: '-' }}</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </div>
        </template>
      </b-table-lite>
    </template>
  </wrap>
</template>
<script>
import base from './base'
import { system, compose, NoID } from '@cortezaproject/corteza-js'

export default {
  i18nOptions: {
    namespaces: 'block',
    key: 'record-revisions',
  },

  components: {},

  extends: base,

  props: {
    record: {
      type: compose.Record,
      required: true,
    },
  },

  data () {
    return {
      /**
       * Last error that occurred
       * while loading the revisions
       */
      error: null,

      /**
       * When true, the revisions are being loaded
       * controled from refresh() method
       */
      processing: false,

      /**
       * When page block is configured to ask user to preload revisions
       * this flag is set to true when user clicks on the button
       */
      preloadRequested: false,

      /**
       * List of revisions when loaded
       */
      revisions: [],

      /**
       * Revisions table fields
       *
       * Please note that table utilizes row-details feature
       * where changes are displayed
       */
      fields: [
        {
          key: 'revision',
          label: '',
          class: 'text-right',
        },
        { key: 'timestamp' },
        { key: 'operation' },
        {
          key: 'user',
          formatter: (u) => u ? (u.name || u.email || u.userID) : '-',
        },
        {
          key: 'adt',
          label: '',
          class: 'nowrap text-right',
        },
      ],
    }
  },

  computed: {
    showHeader () {
      return !!this.block.title || !!this.block.description
    },

    revisionsDisabledOnModule () {
      return !this.module.config.recordRevisions.enabled
    },

    preloadRecords () {
      return this.options.preload || this.preloadRequested
    },
  },

  watch: {
    options: {
      immediate: true,
      deep: true,
      handler () {
        if (this.preloadRecords) {
          this.refresh()
        }
      },
    },

    record: {
      immediate: true,
      handler () {
        if (this.preloadRecords) {
          this.refresh()
        }
      },
    },
  },

  methods: {
    async refresh () {
      this.preloadRequested = true
      if (this.revisionsDisabledOnModule) {
        return
      }

      if (!this.record || this.record.recordID === NoID) {
        return
      }

      this.processing = true
      return this.block.fetch(this.$ComposeAPI, this.record)
        .then(set => { this.revisions = set })
        .then(() => this.resolveUsers())
        .then(() => this.resolveRecords())
        .finally(() => {
          this.processing = false
        })
    },

    async resolveUsers () {
      /**
       * List of all userIDs found in the record revisions
       * that need to be resolved
       */
      const userID = [
        ...(new Set(this.revisions.map(({ userID }) => userID))),
        // @todo add list of values (old and new) from ownedBy field changes
        // @todo add list of values (old and new) from User-kind field changes
      ]

      return this.$SystemAPI
        .userList({ userID })
        .then(({ set }) => {
          const users = set.map(u => new system.User(u))

          this.revisions.forEach(r => {
            const user = users.find(u => u.userID === r.userID)
            if (user) {
              r.user = user
            }
          })
        })
    },

    async resolveRecords () {
      // @todo scan Record-kind field values from revisions
      return undefined
    },
  },
}
</script>

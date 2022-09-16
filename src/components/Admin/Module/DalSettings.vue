<template>
  <div
    v-if="module"
  >
    <b-form-group
      :label="$t('connection.label')"
      :description="$t('connection.description')"
      label-class="text-primary"
    >
      <vue-select
        v-model="module.config.dal.connectionID"
        :options="connections"
        :disabled="processing"
        :clearable="false"
        :reduce="s => s.connectionID"
        :placeholder="$t('connection.placeholder')"
        :get-option-label="getConnectionLabel"
        class="bg-white"
      />
    </b-form-group>

    <b-form-group
      :label="$t('ident.label')"
      :description="$t('ident.description', { interpolation: { prefix: '{{{', suffix: '}}}' } })"
      label-class="text-primary"
    >
      <b-input
        v-model="module.config.dal.ident"
        :placeholder="$t('ident.placeholder')"
      />
    </b-form-group>
    <b-form-group
      :label="$t('system-fields.label')"
      :description="$t('system-fields.description')"
    >
      <b-container>
        <dal-field-store-encoding
          v-for="({ field, storeIdent }) in systemFields"
          :key="field"
          :config="systemFieldEncoding[field] || {}"
          :field="field"
          :store-ident="storeIdent"
          @change="applyStrategyConfig(field, $event)"
        />
      </b-container>
    </b-form-group>
  </div>
</template>

<script>
import { compose, NoID } from '@cortezaproject/corteza-js'
import VueSelect from 'vue-select'
import DalFieldStoreEncoding from 'corteza-webapp-compose/src/components/Admin/Module/DalFieldStoreEncoding'

const PrimaryConnType = 'corteza::system:primary-dal-connection'

export default {
  i18nOptions: {
    namespaces: 'module',
    keyPrefix: 'edit.config.dal',
  },

  components: {
    VueSelect,
    DalFieldStoreEncoding,
  },

  props: {
    module: {
      type: compose.Module,
      required: true,
    },
  },

  data () {
    const systemFieldEncoding = this.module.config.dal.systemFieldEncoding || {}
    const systemFields = [
      { field: 'id', storeIdent: 'id' },
      { field: 'moduleID', storeIdent: 'rel_namespace' },
      { field: 'namespaceID', storeIdent: 'rel_module' },
      { field: 'revision', storeIdent: 'revision' },
      { field: 'meta', storeIdent: 'meta' },
      { field: 'ownedBy', storeIdent: 'created_at' },
      { field: 'createdAt', storeIdent: 'created_by' },
      { field: 'createdBy', storeIdent: 'updated_at' },
      { field: 'updatedAt', storeIdent: 'updated_by' },
      { field: 'updatedBy', storeIdent: 'deleted_at' },
      { field: 'deletedAt', storeIdent: 'deleted_by' },
      { field: 'deletedBy', storeIdent: 'owned_by' },
    ]

    return {
      processing: false,
      connections: [],

      systemFields,
      systemFieldEncoding: systemFields.reduce((enc, { field }) => {
        enc[field] = systemFieldEncoding[field] || {}
        return enc
      }, {}),
    }
  },

  mounted () {
    this.fetchConnections()
  },

  methods: {
    async fetchConnections () {
      this.processing = true
      return this.$SystemAPI.dalConnectionList()
        .then(({ set = [] }) => {
          this.connections = set

          const { connectionID } = this.module.config.dal || {}
          if (!connectionID || connectionID === NoID) {
            const primaryConnectionID = (this.connections.find(c => c.type === PrimaryConnType) || { connectionID: NoID }).connectionID
            this.module.config.dal.connectionID = primaryConnectionID
          }
        })
        .catch(this.toastErrorHandler(this.$t('connections.fetch-failed')))
        .finally(() => {
          this.processing = false
        })
    },

    getConnectionLabel ({ connectionID, handle, meta = {} }) {
      return meta.name || handle || connectionID
    },

    applyStrategyConfig (field, config) {
      // merge new config into existing
      this.systemFieldEncoding = { ...this.systemFieldEncoding, [field]: config }

      // filter out empty configs and update the original config
      this.module.config.dal.systemFieldEncoding = Object.entries(this.systemFieldEncoding)
        .reduce((enc, [f, c]) => {
          if (c === null || Object.keys(c).length) {
            enc[f] = c
          }
          return enc
        }, {})
    },
  },
}
</script>

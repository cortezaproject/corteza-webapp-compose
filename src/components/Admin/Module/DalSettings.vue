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
      :description="$t('ident.description')"
      label-class="text-primary"
    >
      <b-input
        v-model="module.config.dal.ident"
        :placeholder="$t('ident.placeholder')"
      />
    </b-form-group>
  </div>
</template>

<script>
import { compose, NoID } from '@cortezaproject/corteza-js'
import VueSelect from 'vue-select'

const PrimaryConnType = 'corteza::system:primary-dal-connection'

export default {
  i18nOptions: {
    namespaces: 'module',
    keyPrefix: 'edit.config.dal',
  },

  components: {
    VueSelect,
  },

  props: {
    module: {
      type: compose.Module,
      required: true,
    },
  },

  data () {
    return {
      processing: false,
      connections: [],
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
  },
}
</script>

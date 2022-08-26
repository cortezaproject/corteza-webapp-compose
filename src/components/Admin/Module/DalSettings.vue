<template>
  <b-container
    v-if="module"
  >
    <b-form-group
      :label="$t('connection')"
      label-class="text-primary"
    >
      <vue-select
        v-model="selectedConnectionID"
        :options="connections"
        :disabled="!editable || processing"
        :clearable="false"
        :reduce="s => s.ID"
        label="label"
        value="ID"
        class="bg-white"
      />
    </b-form-group>
    <b-form-group
      :label="$t('ident')"
      :description="$t('ident-description')"
      label-class="text-primary"
    >
      <b-input
        v-model="module.config.dal.ident"
        :disabled="!editable"
        :placeholder="$t('ident-placeholder')"
        @change="module.config.dal.partitioned=true"
      />
    </b-form-group>
  </b-container>
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

    editable: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      processing: false,
      connections: [],
    }
  },

  computed: {
    /**
     * Returns configured connection
     */
    selectedConnectionID: {
      get () {
        const { connectionID: ID = NoID } = this.module.config.dal

        if (ID === NoID) {
          return this.primaryConnectionID
        }

        return ID
      },

      /**
       * Keep NoID when primary connection is used
       * @todo could be handled on the backend
       */
      set (value) {
        if (value === this.primaryConnectionID) {
          this.module.config.dal.connectionID = NoID
        } else {
          this.module.config.dal.connectionID = value
        }
      },
    },

    /**
     * Returns ID of the primary connection and fallsback to NoID
     */
    primaryConnectionID () {
      return (this.connections.find(c => c.type === PrimaryConnType) || { ID: NoID }).ID
    },
  },

  mounted () {
    this.fetchConnections()
  },

  methods: {
    async fetchConnections () {
      this.processing = true
      return this.$SystemAPI.dalConnectionList()
        .then(({ set = [] }) => {
          console.log('loading...')
          this.connections = set.map(({ connectionID: ID, handle, type, meta: { name }, config }) => ({
            ID,
            label: name || handle || ID,
            config,
            type,
          }))
        })
        .catch(this.toastErrorHandler(this.$t('connections.fetch-failed')))
        .finally(() => {
          this.processing = false
        })
    },
  },
}
</script>

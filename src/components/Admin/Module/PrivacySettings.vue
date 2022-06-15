<template>
  <b-modal
    v-model="showModal"
    :title="$t('privacy.title')"
    :ok-title="$t('general.label.saveAndClose')"
    ok-only
    ok-variant="primary"
    size="lg"
    @show="fetchConnections()"
    @ok="onSave()"
  >
    <b-form-group
      :label="$t('privacy.data-source')"
      label-class="text-primary"
      :class="{ 'mb-0': !connection }"
    >
      <vue-select
        v-model="connection"
        :options="connections"
        :disabled="isEdit"
        :clearable="false"
        label="name"
        :placeholder="$t('privacy.select-data-source')"
        class="h-100 bg-white"
      />
    </b-form-group>

    <div
      v-if="connection"
    >
      <b-row>
        <b-col
          cols="12"
          sm="8"
        >
          <b-form-group
            :label="$t('privacy.location')"
            label-class="text-primary"
          >
            {{ connectionLocationName }}
          </b-form-group>
        </b-col>
        <b-col
          cols="12"
          sm="4"
        >
          <b-form-group
            :label="$t('privacy.ownership')"
            label-class="text-primary"
          >
            {{ connection.ownership }}
          </b-form-group>
        </b-col>
      </b-row>

      <hr>

      <b-row
        class="mt-4 pt-2"
      >
        <b-col
          v-for="cap in capabilityTypes"
          :key="cap"
          cols="12"
          sm="6"
          lg="4"
        >
          <b-form-group
            class="mb-4"
          >
            <template #label>
              <div
                class="d-flex align-items-center text-capitalize text-primary mr-5"
              >
                {{ cap.split('corteza::dal:capability:')[1] }}
                <font-awesome-icon
                  :icon="['far', 'question-circle']"
                  class="text-dark ml-2"
                />
              </div>
            </template>

            <b-form-checkbox
              v-model="capabilities[cap].enabled"
              :disabled="capabilities[cap].support != 'supported'"
              class="text-capitalize"
            >
              {{ capabilities[cap].support === 'supported' ? 'Enabled' : capabilities[cap].support }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import { compose, NoID } from '@cortezaproject/corteza-js'
import VueSelect from 'vue-select'

export default {
  i18nOptions: {
    namespaces: 'module',
  },

  components: {
    VueSelect,
  },

  props: {
    modal: {
      type: Boolean,
      required: false,
    },

    module: {
      type: compose.Module,
      required: true,
    },
  },

  data () {
    return {
      connection: undefined,

      connections: [],

      capabilities: {
        'corteza::dal:capability:create': { support: 'unsupported', enabled: false },
        'corteza::dal:capability:update': { support: 'unsupported', enabled: false },
        'corteza::dal:capability:delete': { support: 'unsupported', enabled: false },
        'corteza::dal:capability:search': { support: 'unsupported', enabled: false },
        'corteza::dal:capability:lookup': { support: 'unsupported', enabled: false },
        'corteza::dal:capability:paging': { support: 'unsupported', enabled: false },
        'corteza::dal:capability:stats': { support: 'unsupported', enabled: false },
        'corteza::dal:capability:sorting': { support: 'unsupported', enabled: false },
        'corteza::dal:capability:RBAC': { support: 'unsupported', enabled: false },
      },
    }
  },

  computed: {
    isEdit () {
      return this.module.moduleID !== NoID
    },

    showModal: {
      get () {
        return this.modal
      },

      set (showModal) {
        this.$emit('update:modal', showModal)
      },
    },

    connectionLocationName () {
      const { name } = this.connection.location.properties
      return name || ''
    },

    capabilityTypes () {
      return Object.keys(this.capabilities)
    },
  },

  watch: {
    'connection.connectionID': {
      immediate: true,
      handler () {
        const { capabilities = {} } = this.connection || {}
        const enabled = capabilities.enabled || []
        const types = ['enforced', 'supported', 'unsupported']

        types.forEach(support => {
          (capabilities[support] || []).forEach(c => {
            this.capabilities[c] = { support, enabled: enabled.includes(c) }
          })
        })
      },
    },
  },

  methods: {
    fetchConnections () {
      this.processing = true
      this.connection = undefined
      const { connectionID = NoID, capabilities = [] } = this.module.modelConfig || ''

      this.$SystemAPI.dalConnectionList()
        .then(({ set = [] }) => {
          this.connections = set.map(c => {
            if (c.connectionID === connectionID) {
              c.capabilities.enabled = capabilities
            }

            return c
          })

          this.connection = set.find(({ connectionID }) => connectionID === this.module.modelConfig.connectionID) || set[0]
        })
        .catch(this.toastErrorHandler(this.$t('Failed to load connections')))
        .finally(() => {
          this.processing = false
        })
    },

    onSave () {
      const capabilities = []
      this.capabilityTypes.forEach(cap => {
        const { enabled } = this.capabilities[cap]
        if (enabled) {
          capabilities.push(cap)
        }
      })

      this.module.modelConfig.connectionID = this.connection.connectionID
      this.module.modelConfig.capabilities = capabilities
      this.module.modelConfig.partitioned = false

      this.$emit('save', this.module.modelConfig)
    },
  },
}
</script>

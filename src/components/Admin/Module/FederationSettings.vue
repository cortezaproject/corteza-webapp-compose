<template>
  <b-modal
    v-model="showModal"
    :title="federationModalTitle"
    :ok-title="$t('general.label.saveAndClose')"
    ok-only
    ok-variant="dark"
    size="lg"
    body-class="p-0 border-top-0"
    header-class="p-3 pb-0 border-bottom-0"
    @ok="handleFederationSettingsSave()"
    @change="$emit('change', $event)"
  >
    <b-tabs
      active-nav-item-class="bg-grey"
      nav-wrapper-class="bg-white"
      active-tab-class="tab-content h-auto overflow-auto"
      card
    >
      <b-tab
        :title="$t('module.edit.federationSettings.general.title')"
        active
      >
        <b-form-group
          class="mb-0"
        >
          <b-form-checkbox
            v-model="upstream.enabled"
          >
            {{ $t('module.edit.federationSettings.general.send') }}
          </b-form-checkbox>

          <b-form-checkbox
            v-model="downstream.enabled"
          >
            {{ $t('module.edit.federationSettings.general.receive') }}
          </b-form-checkbox>
        </b-form-group>
      </b-tab>
      <b-tab
        :title="$t('module.edit.federationSettings.upstream.title')"
      >
        <b-list-group
          vertical
          class="overflow-auto flex-grow-3"
        >
          <b-list-group-item
            v-for="f in servers"
            :key="f.nodeID"
            href="#"
            :class="{ 'border border-primary': f.nodeID === upstream.active }"
            class="border"
            @click="upstream.active = f.nodeID"
          >
            {{ f.name }}<br>
            <small>{{ f.url }}</small>
          </b-list-group-item>
        </b-list-group>

        <div
          v-if="upstream.processing"
          class="d-flex flex-grow-1 justify-content-center align-items-center"
        >
          <b-spinner
            variant="primary"
          />
        </div>

        <div
          v-else-if="upstream[upstream.active]"
          class="list-group flex-grow-1 ml-4"
        >
          {{ $t('module.edit.federationSettings.downstream.description') }}
          <b-form-group
            label-cols-sm="4"
            label-cols-lg="5"
            label="Copy settings from"
          >
            <b-form-select
              :key="upstream.active"
              v-model="upstream[upstream.active].copy"
              :options="upstream[upstream.active].options"
              value-field="nodeID"
              text-field="name"
              @change="setNodeStatus('upstream')"
            />
          </b-form-group>

          <b-form-checkbox
            :checked="upstream[upstream.active].allFields"
            class="mb-2"
            @change="selectAllFields($event, 'upstream')"
          >
            <strong>{{ $t('module.edit.federationSettings.upstream.allFields') }}</strong>
          </b-form-checkbox>

          <div
            class="overflow-auto"
          >

            <b-form-checkbox
              v-for="f in upstream[upstream.active].fields"
              :key="`${upstream.active}${f.name}`"
              v-model="f.value"
              class="mb-2"
              @change="setNodeStatus('upstream')"
            >
              {{ f.label }}
            </b-form-checkbox>
          </div>
        </div>

        <div
          v-else
          class="d-flex flex-grow-1 align-items-center justify-content-center"
        >
          {{ $t('module.edit.federationSettings.errorFetchingData') }}
        </div>
      </b-tab>
      <b-tab
        :title="$t('module.edit.federationSettings.downstream.title')"
      >
        <b-list-group
          vertical
          class="overflow-auto"
        >
          <b-list-group-item
            v-for="f in servers"
            :key="f.nodeID"
            href="#"
            :class="{ 'border border-primary': f.nodeID === downstream.active }"
            class="border"
            @click="downstream.active = f.nodeID"
          >
            {{ f.name }}<br>
            <small>{{ f.url }}</small>
          </b-list-group-item>
        </b-list-group>

        <div
          v-if="downstream.processing"
          class="d-flex flex-grow-1 justify-content-center align-items-center"
        >
          <b-spinner
            variant="primary"
          />
        </div>

        <div
          v-else-if="downstream[downstream.active]"
          class="list-group flex-grow-1 ml-4"
        >
          <b-form-group>
            <b-form-select
              :key="downstream.active"
              v-model="downstream[downstream.active].module"
              :options="downstream[downstream.active].options"
              value-field="moduleID"
              text-field="name"
              class="w-50"
              @change="setNodeStatus('downstream')"
            />
          </b-form-group>

          <div
            v-if="downstream[downstream.active].module"
            class="mb-2"
          >
            {{ $t('module.edit.federationSettings.downstream.description') }}
            <b-form-checkbox
              :checked="downstream[downstream.active].allFields"
              @change="selectAllFields($event, 'downstream')"
            >
              <strong>{{ $t('module.edit.federationSettings.downstream.allFields') }}</strong>
            </b-form-checkbox>
          </div>

          <div
            v-if="downstream[downstream.active].module"
            class="overflow-auto"
          >
            <div
              v-for="f in downstream[downstream.active].fields"
              :key="`${downstream.active}_${f.name}`"
              class="d-flex align-items-center justify-content-between mb-1"
            >
              <b-form-checkbox
                v-model="f.value"
                @change="setNodeStatus('downstream')"
              >
                {{ f.label }}
              </b-form-checkbox>

              <b-form-select
                :key="`${downstream.active}_${f.name}`"
                v-model="f.map"
                :options="downstream[downstream.active].federatedFields"
                value-field="name"
                text-field="label"
                class="w-50"
                @change="setNodeStatus('downstream')"
              />
            </div>
          </div>
        </div>

        <div
          v-else
          class="d-flex flex-grow-1 align-items-center justify-content-center"
        >
          {{ $t('module.edit.federationSettings.errorFetchingData') }}
        </div>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
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
      showModal: false,

      servers: [],

      moduleFields: [],

      downstream: {
        active: undefined,
        processing: false,
        enabled: false,
      },

      upstream: {
        active: undefined,
        processing: false,
        enabled: false,
      },
    }
  },

  computed: {
    federationModalTitle () {
      const { handle } = this.module
      return handle ? this.$t('module.edit.federationSettings.specificTitle', { handle }) : this.$t('module.edit.federationSettings.title')
    },
  },

  watch: {
    modal: {
      immediate: true,
      handler (show = false) {
        this.showModal = show
      },
    },

    'module.fields': {
      immediate: true,
      handler (fields) {
        this.moduleFields = fields.map(f => {
          return {
            ...f,
            value: false,
            map: null,
          }
        })
      },
    },

    'upstream.active': {
      handler (nodeID) {
        this.getNodeUpstream(nodeID)
      },
    },

    'downstream.active': {
      handler (nodeID) {
        this.getNodeDownstream(nodeID)
      },
    },
  },

  created () {
    this.servers = [
      { nodeID: '0', name: 'Bromley High School', url: 'bromley.com', email: 'bromley@mail.com', enabled: 'True', status: 'Paired', labels: ['Education', 'HR'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
      { nodeID: '1', name: 'Northwood College for Girls', url: 'northwood.com', enabled: 'True', status: 'Paired', labels: ['Education'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
    ]

    // this.servers = this.$FederationAPI.nodeSearch({ status: 'paired' })
    //   .catch(this.defaultErrorHandler)

    if (this.servers.length) {
      this.downstream.active = this.servers[0].nodeID
      this.upstream.active = this.servers[0].nodeID
    }
  },

  methods: {
    handleFederationSettingsSave () {
      // TODO which endpoints to call for which node/federation type
    },

    async getNodeUpstream (nodeID) {
      if (this.upstream[nodeID]) {
        return
      }

      this.upstream.processing = true

      // Status of the node setting, different for each type (upstream/downstream)
      // Each status calls(or doesn't) a different endpoint:
      // 'ignore' - No endpoint called
      // 'new' - Create endpoint
      // 'update' - Update endpoint
      let status = 'ignore'

      const uSetting = await this.$FederationAPI.manageStructureReadShared({ nodeID, moduleID: this.module.moduleID })
        .catch(err => {
          status = 'new'
          this.defaultErrorHandler(err)
        })

      const upstream = {
        options: [
          { moduleID: null, name: this.$t('module.edit.federationSettings.pickServer') },
          ...this.servers.filter(s => s.nodeID !== nodeID),
        ],
        copy: null,
        allFields: false,
        fields: this.moduleFields || [],
        status,
      }

      const settingFields = ((uSetting || {}).fields || [])
      settingFields.forEach(f => {
        const mf = (upstream.fields.find(({ name }) => name === f.name) || {})
        mf.value = true
        mf.map = f.map
      })

      this.$set(this.upstream, nodeID, upstream)
      this.upstream.processing = false
    },

    async getNodeDownstream (nodeID) {
      if (this.downstream[nodeID]) {
        return
      }

      this.downstream.processing = true

      let status = 'ignore'
      const dSetting = await this.$FederationAPI.manageStructureReadExposed({ nodeID, moduleID: this.module.moduleID })
        .catch(err => {
          status = 'new'
          this.defaultErrorHandler(err)
        })

      const downstream = {
        options: [
          { moduleID: null, name: this.$t('module.edit.federationSettings.pickModule') },
          { moduleID: '0', name: 'Test shared module' },
        ],
        module: null,
        allFields: false,
        fields: this.moduleFields || [],
        federatedFields: [
          { name: null, label: this.$t('module.edit.federationSettings.pickModuleField') },
        ],
        status,
      }

      const settingFields = ((dSetting || {}).fields || [])
      settingFields.forEach(f => {
        const mf = (downstream.fields.find(({ name }) => name === f.name) || {})
        mf.value = true
        mf.map = f.map
      })

      this.$set(this.downstream, nodeID, downstream)
      this.downstream.processing = false
    },

    selectAllFields (value, target) {
      const active = this[target].active
      this[target][active].fields = this[target][active].fields.map(f => ({ ...f, value }))
      this[target][active].allFields = true
      this[target][active].status = 'update'
    },

    setNodeStatus (target, status = 'update') {
      const active = this[target].active
      this[target][active].status = status
    },
  },
}
</script>

<style lang="scss" scoped>
.tab-content {
  min-height: 0;
  max-height: 70vh;
  display: flex;
}
</style>

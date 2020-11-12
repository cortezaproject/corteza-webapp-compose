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
        active
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
          {{ $t('module.edit.federationSettings.upstream.description') }}
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
              v-for="f in activeExposedModuleFields"
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

      <!-- downstream tab -->
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
          <!-- dropdown list of federated shared modules -->
          <b-form-group>
            <b-form-select
              :key="downstream.active"
              v-model="sharedModule"
              :options="sharedModuleOptions"
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
            v-if="sharedModule"
            class="overflow-auto"
          >
            <!-- list of fields per shared module -->
            <div
              v-for="sharedModule in activeSharedModules"
              :key="`${downstream.active}_${sharedModule.name}`"
              class="d-flex align-items-center justify-content-between mb-1"
            >
              <b-form-checkbox
                v-model="sharedModule.map"
                @change="setNodeStatus('downstream')"
              >
                {{ sharedModule.label }}
              </b-form-checkbox>

              <!-- dropdown with a list of compose module fields -->
              <b-form-select
                :key="`${downstream.active}_${sharedModule.name}`"
                v-model="sharedModule.mapped"
                :options="transformedModuleFields"
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

      sharedModule: null,

      sharedModules: {},
      exposedModules: {},
      moduleMappings: {},

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
    //
    // exposed modules
    //
    activeExposedModuleFields () {
      return Object.values(this.activeExposedModules[this.upstream.active])[0] || []
    },

    activeExposedModules () {
      const fields = {}

      for (const node of this.servers) {
        const nodeID = node.nodeID
        const emFields = ((((this.exposedModules[nodeID] || [])[0]) || {}).fields) || []
        const em = ((this.exposedModules[nodeID] || [])[0]) || {}
        const emID = em.moduleID || ''

        fields[nodeID] = {}
        fields[nodeID][emID] = this.moduleFields.map((mf) => {
          const r = {
            name: mf.name,
            kind: mf.kind,
            map: false,
            value: false,
            label: mf.label,
            isMulti: mf.isMulti,
          }

          if (!emFields.length) return r

          return {
            ...r,
            map: null,
            value: !!emFields.find(({ name }) => name === mf.name),
          }
        })
      }

      return fields
    },

    //
    // shared modules
    //
    activeSharedModules () {
      if (!this.sharedModule) return []
      return (this.sharedModulesMapped[this.downstream.active] || {})[this.sharedModule] || []
    },

    sharedModuleOptions () {
      return [
        { moduleID: null, name: this.$t('module.edit.federationSettings.pickModule') },
        ...Object.values(this.sharedModules[this.downstream.active]).map(m => ({ moduleID: m.moduleID, name: m.name })),
      ]
    },

    // shared module fields get prepopulated here
    // the module mappings also get applied here
    // on top of the fields
    sharedModulesMapped () {
      var list = {}

      // first, prefill the shared module fields
      for (const nodeID in this.sharedModules) {
        list[nodeID] = {}

        for (const sm of this.sharedModules[nodeID]) {
          var f = sm.fields

          // is there any mappings for this shared module?
          const mappedFields = ((this.moduleMappings[nodeID] || {})[sm.moduleID] || {}).fields || []

          // fetch the shared module fields and slap the
          // module mappings on top of them
          f = f.map((el) => {
            var found = false
            var mapped = ''

            if (mappedFields) {
              const m = mappedFields.find((mf) => el.name === mf.origin.name)

              mapped = ((m || {}).destination || {}).name || ''
              found = !!mapped
            }

            return {
              ...el,
              map: found,
              mapped,
            }
          })

          list[nodeID][sm.moduleID] = f
        }
      }

      return list
    },

    sharedModuleFields () {
      return (this.getSharedModule() || {}).fields || []
    },

    transformedModuleMappings () {
      // get the transformed module fields
      const tf = this.transformFields(this.moduleFields)

      // get the module mappings and convert it to the appropriate structure
      const mm = ((this.sharedModules[this.downstream.active] || {})[this.sharedModule] || {}).fields || []

      return tf.map((el) => {
        el.origin.value = false

        if (mm.find((e) => e.origin.name === el.origin.name)) {
          el.destination.name = el.origin.name
          el.origin.value = true
        }
        return el
      })
    },

    // used on module field dropdown on field mapping screen
    transformedModuleFields () {
      return [
        { name: null, label: this.$t('module.edit.federationSettings.pickModuleField') },
        ...this.transformedModuleMappings.map((el) => ({
          name: el.origin.name,
          label: el.origin.label,
        })),
      ]
    },

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
            kind: f.kind,
            name: f.name,
            label: f.label,
            isMulti: f.isMulti,
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

  async mounted () {
    // faking FederationAPI base url for now
    this.$FederationAPI.baseURL = window.ComposeAPI.replace('/compose', '/federation')
    this.preload()
  },

  methods: {
    async preload () {
      this.servers = await this.$FederationAPI.nodeSearch({ status: 'paired' })
        .then(({ set }) => set)
        .catch(this.defaultErrorHandler)

      for (const node of this.servers) {
        await this.loadSharedModules(node.nodeID).catch(this.defaultErrorHandler)
        await this.loadExposedModules(node.nodeID).catch(this.defaultErrorHandler)
        await this.loadModuleMappings(node.nodeID).catch(this.defaultErrorHandler)
      }

      if (this.servers.length) {
        this.downstream.active = this.servers[0].nodeID
        this.upstream.active = this.servers[0].nodeID
      }
    },

    getSharedModule () {
      return (this.sharedModules[this.downstream.active] || []).find((el) => el.moduleID === this.sharedModule)
    },

    async handleFederationSettingsSave () {
      // module mappings (downstream)
      for (const nodeID in this.sharedModulesMapped) {
        for (const moduleID in this.sharedModulesMapped[nodeID]) {
          const fields = this.toModuleMappingFormat(this.sharedModulesMapped[nodeID][moduleID])

          if (!fields.length) continue

          const payload = {
            nodeID,
            moduleID,
            composeModuleID: this.module.moduleID,
            composeNamespaceID: this.module.namespaceID,
            fields,
          }

          await this.persistModuleMappings(payload).catch(this.defaultErrorHandler)
        }
      }

      // upstream
      for (const nodeID in this.activeExposedModules) {
        for (const moduleID in this.activeExposedModules[nodeID]) {
          const fields = this.activeExposedModules[nodeID][moduleID].filter((el) => el.value)

          // skip empty payloads
          if (!fields.length) continue

          const payload = {
            nodeID,
            moduleID,
            composeModuleID: this.module.moduleID,
            composeNamespaceID: this.module.namespaceID,
            name: this.module.name,
            handle: this.module.handle,
            fields,
          }

          const response = await this.persistExposedModule(payload).catch(this.defaultErrorHandler)

          if (!response && !response.moduleID) {
            return
          }

          const index = this.exposedModules[nodeID].findIndex((el) => el.moduleID === response.moduleID)

          if (index > 0) {
            this.exposedModules[nodeID][index] = response
          } else {
            this.exposedModules[nodeID].push(response)
          }
        }
      }
    },

    // transform internal module mappings to
    // server api format
    // [{ name, kind, ...}] => [{origin: { name, kind }, destination: { name, kind }}]
    toModuleMappingFormat (fields) {
      return fields
        .filter((el) => el.map)
        .filter((el) => !!el.mapped)
        .map((el) => ({
          origin: {
            kind: el.kind,
            name: el.name,
            label: el.label,
            isMulti: el.isMulti,
          },
          destination: {
            kind: el.kind,
            name: el.mapped,
            label: el.label,
            isMulti: el.isMulti,
          },
        }))
    },

    transformFields (fields) {
      return fields.map((el) => ({
        origin: {
          kind: el.kind,
          name: el.name,
          label: el.label || 'N/A',
          isMulti: false,
        },
        destination: {
          kind: el.kind,
          name: '',
          label: '',
          isMulti: false,
        },
      }))
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
      this.downstream.processing = true

      const status = 'ignore'
      const dSetting = {}

      const downstream = {
        module: null,
        allFields: false,
        fields: this.moduleFields || [],
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

    async getSharedModules (nodeID) {
      return this.$FederationAPI.manageStructureListAll({ nodeID, shared: 1 })
        .then((data) => data)
        .catch(this.defaultErrorHandler)
    },

    async getExposedModules (nodeID) {
      return this.$FederationAPI.manageStructureListAll({ nodeID, exposed: 1 })
        .then((data) => data)
        .catch(this.defaultErrorHandler)
    },

    async getModuleMappings (nodeID, moduleID) {
      return this.$FederationAPI.manageStructureReadMappings({ nodeID, moduleID })
        .then((data) => data)
        .catch(this.defaultErrorHandler)
    },

    async persistExposedModule (payload) {
      if (payload.moduleID) {
        return this.$FederationAPI.manageStructureUpdateExposed(payload)
      }

      return this.$FederationAPI.manageStructureCreateExposed(payload)
    },

    async persistModuleMappings (payload) {
      return this.$FederationAPI.manageStructureCreateMappings(payload).catch(this.defaultErrorHandler)
    },

    //
    // preloaders
    //
    async loadSharedModules (nodeID) {
      if (this.sharedModules[nodeID]) {
        return
      }

      this.sharedModules[nodeID] = await this.getSharedModules(nodeID)
    },

    async loadExposedModules (nodeID) {
      if (this.exposedModules[nodeID]) {
        return
      }

      this.exposedModules[nodeID] = await this.getExposedModules(nodeID)
    },

    async loadModuleMappings (nodeID) {
      if (this.moduleMappings[nodeID] || !this.sharedModules[nodeID]) {
        return
      }

      var mm = {}
      for (const sm of this.sharedModules[nodeID]) {
        mm[sm.moduleID] = await this.getModuleMappings(nodeID, sm.moduleID).catch(() => [])
      }

      this.moduleMappings[nodeID] = mm
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

<template>
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
          v-model="settings.general.send"
        >
          {{ $t('module.edit.federationSettings.general.send') }}
        </b-form-checkbox>

        <b-form-checkbox
          v-model="settings.general.receive"
        >
          {{ $t('module.edit.federationSettings.general.receive') }}
        </b-form-checkbox>
      </b-form-group>
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
          :key="f.federationID"
          href="#"
          :class="{ 'border border-primary': f.federationID === downstream.active }"
          class="border"
          @click="downstream.active = f.federationID"
        >
          {{ f.name }}<br>
          <small>{{ f.url }}</small>
        </b-list-group-item>
      </b-list-group>

      <div
        class="pl-4"
      >
        {{ $t('module.edit.federationSettings.downstream.description') }}

        <b-form-group
          label-cols-sm="4"
          label-cols-lg="5"
          label="Copy settings from"
        >
          <b-form-select
            :key="downstream.active"
            v-model="downstream[downstream.active].copy"
            :options="downstream[downstream.active].options"
            value-field="federationID"
            text-field="name"
          />
        </b-form-group>

        <b-form-checkbox
          :checked="downstream[downstream.active].allFields"
          class="mb-2"
          @change="selectAllFields($event, 'downstream')"
        >
          <strong>{{ $t('module.edit.federationSettings.downstream.allFields') }}</strong>
        </b-form-checkbox>

        <b-form-checkbox
          v-for="f in downstream[downstream.active].fields"
          :key="`${downstream.active}${f.name}`"
          v-model="f.value"
          class="mb-2"
        >
          {{ f.label }}
        </b-form-checkbox>
      </div>
    </b-tab>
    <b-tab
      :title="$t('module.edit.federationSettings.upstream.title')"
    >
      <b-list-group
        vertical
        class="overflow-auto"
      >
        <b-list-group-item
          v-for="f in servers"
          :key="f.federationID"
          href="#"
          :class="{ 'border border-primary': f.federationID === upstream.active }"
          class="border"
          @click="upstream.active = f.federationID"
        >
          {{ f.name }}<br>
          <small>{{ f.url }}</small>
        </b-list-group-item>
      </b-list-group>

      <div
        class="flex-grow-1 pl-4"
      >
        <b-form-group>
          <b-form-select
            :key="upstream.active"
            v-model="upstream[upstream.active].module"
            :options="upstream[upstream.active].options"
            value-field="moduleID"
            text-field="name"
            class="w-50"
          />
        </b-form-group>
        <div
          v-if="upstream[upstream.active].module"
        >
          {{ $t('module.edit.federationSettings.upstream.description') }}

          <b-form-checkbox
            :checked="upstream[upstream.active].allFields"
            class="mb-2"
            @change="selectAllFields($event, 'upstream')"
          >
            <strong>{{ $t('module.edit.federationSettings.upstream.allFields') }}</strong>
          </b-form-checkbox>

          <div
            v-for="f in upstream[upstream.active].fields"
            :key="`${upstream.active}_${f.name}`"
            class="d-flex align-items-center justify-content-between mb-1"
          >
            <b-form-checkbox
              v-model="f.value"
            >
              {{ f.label }}
            </b-form-checkbox>

            <b-form-select
              :key="`${upstream.active}_${f.name}`"
              v-model="f.map"
              :options="federatedModuleFields"
              value-field="name"
              text-field="label"
              class="w-50"
            />
          </div>
        </div>
      </div>
    </b-tab>
  </b-tabs>
</template>
<script>
export default {
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      downstream: {
        active: undefined,
      },

      upstream: {
        active: undefined,
      },
    }
  },

  computed: {
    servers () {
      return [
        { federationID: '0', name: 'Bromley High School', url: 'bromley.com', email: 'bromley@mail.com', enabled: 'True', status: 'Paired', labels: ['Education', 'HR'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
        { federationID: '1', name: 'Northwood College for Girls', url: 'northwood.com', enabled: 'True', status: 'Paired', labels: ['Education'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
        { federationID: '2', name: 'Bromley High School', url: 'bromley.com', email: 'bromley@mail.com', enabled: 'True', status: 'Paired', labels: ['Education', 'HR'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
        { federationID: '3', name: 'Northwood College for Girls', url: 'northwood.com', enabled: 'True', status: 'Paired', labels: ['Education'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
        { federationID: '4', name: 'Bromley High School', url: 'bromley.com', email: 'bromley@mail.com', enabled: 'True', status: 'Paired', labels: ['Education', 'HR'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
        { federationID: '5', name: 'Northwood College for Girls', url: 'northwood.com', enabled: 'True', status: 'Paired', labels: ['Education'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
        { federationID: '6', name: 'Bromley High School', url: 'bromley.com', email: 'bromley@mail.com', enabled: 'True', status: 'Paired', labels: ['Education', 'HR'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
        { federationID: '8', name: 'Northwood College for Girls', url: 'northwood.com', enabled: 'True', status: 'Paired', labels: ['Education'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
        { federationID: '9', name: 'Bromley High School', url: 'bromley.com', email: 'bromley@mail.com', enabled: 'True', status: 'Paired', labels: ['Education', 'HR'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
        { federationID: '10', name: 'Northwood College for Girls', url: 'northwood.com', enabled: 'True', status: 'Paired', labels: ['Education'], createdAt: new Date(), fields: [{ name: 'TestField', label: 'Test Field', value: false, map: null }, { name: 'TestField2', label: 'Test Field2', value: false, map: null }] },
      ]
    },

    federatedModuleFields () {
      return [
        { name: null, label: 'Pick a module field' },
        { name: 'Account', label: 'Account' },
        { name: 'Owner', label: 'Owner' },
      ]
    },

  },

  watch: {
    servers: {
      immediate: true,
      handler (servers) {
        this.downstream.active = servers[0].federationID
        this.upstream.active = servers[0].federationID

        servers.forEach(({ federationID, fields }, index) => {
          const dSetting = this.settings.downstream[federationID] || { fields: [] }
          const downstream = {
            options: [
              { federationID: null, name: this.$t('module.edit.federationSettings.pickModule') },
              ...servers.filter(s => s.federationID !== federationID),
            ],
            copy: dSetting.copy || null,
            allFields: fields.length === dSetting.fields.length,
            fields,
          }

          const uSetting = this.settings.upstream[federationID] || { fields: [] }
          const upstream = {
            options: [
              { moduleID: null, name: this.$t('module.edit.federationSettings.pickModule') },
              { moduleID: '0', name: 'Accounts' },
            ],
            module: uSetting.module || null,
            allFields: fields.length === uSetting.fields.length,
            fields,
          }

          this.$set(this.downstream, federationID, downstream)
          this.$set(this.upstream, federationID, upstream)
        })
      },
    },
  },

  methods: {
    selectAllFields (value, target) {
      const active = this[target].active
      this[target][active].fields = this[target][active].fields.map(f => ({ ...f, value }))
      this[target][active].allFields = true
    },

    updateField (value, target, field) {
      const active = this[target].active
      this[target][active].fields.find(f => f.name === field.name).value = value
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

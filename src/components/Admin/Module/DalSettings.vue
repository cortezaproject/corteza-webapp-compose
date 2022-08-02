<template>
  <b-container
    v-if="module"
  >
    <b-form-group
      :label="$t('connection')"
      label-class="text-primary"
    >
      <vue-select
        v-model="module.config.dal.connectionID"
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
        v-model="module.config.dal.partitionFormat"
        :disabled="!editable"
        :placeholder="$t('ident-placeholder')"
        @change="module.config.dal.partitioned=true"
      />
    </b-form-group>
  </b-container>
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'
import VueSelect from 'vue-select'

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
      defaultIdent: false,
      connections: [],
    }
  },

  mounted () {
    this.fetchConnections()

    this.defaultIdent = this.module.config.dal.partitionFormat.length === 0
  },

  methods: {
    async fetchConnections () {
      this.processing = true
      return this.$SystemAPI.dalConnectionList()
        .then(({ set = [] }) => {
          this.connections = set.map(({ connectionID: ID, handle, meta: { name }, config }) => ({
            ID,
            label: name || handle || ID,
            config,
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

<template>
  <b-container
    v-if="module"
  >
    <b-form-group
      :label="$t('sensitivity-level.label')"
      :description="$t('sensitivity-level.description')"
      label-class="text-primary"
    >
      <vue-select
        v-model="module.config.privacy.sensitivityLevelID"
        :options="sensitivityLevels"
        :disabled="processing"
        :clearable="false"
        :reduce="s => s.ID"
        :placeholder="$t('sensitivity-level.placeholder')"
        label="label"
        value="ID"
        class="bg-white"
      />
    </b-form-group>
    <b-form-group
      :label="$t('usage-disclosure.label')"
      label-class="text-primary"
    >
      <b-textarea
        v-model="module.config.privacy.usageDisclosure"
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
    keyPrefix: 'edit.config.privacy',
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

      sensitivityLevels: [],
    }
  },

  mounted () {
    this.fetchSensitivityLevels()
  },

  methods: {
    async fetchSensitivityLevels () {
      this.processing = true

      return this.$SystemAPI.dalSensitivityLevelList()
        .then(({ set = [] }) => {
          this.sensitivityLevels = set.map(({ sensitivityLevelID: ID, handle, meta: { name } }) => ({
            ID,
            label: name || handle || ID,
          }))
        })
        .catch(this.toastErrorHandler(this.$t('sensitivity-levels.fetch-failed')))
        .finally(() => {
          this.processing = false
        })
    },

  },
}
</script>

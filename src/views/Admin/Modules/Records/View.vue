<template>
  <div class="d-flex flex-column w-100 overflow-hidden">
    <b-alert
      v-if="isDeleted"
      show
      variant="info"
      class="mb-0"
    >
      {{ $t('block.record.recordDeleted') }}
    </b-alert>
    <main
      class="flex-grow-1 flex-wrap overflow-auto d-flex"
      v-if="module && record"
    >
      <b-card
        v-for="(fieldSet, index) in fields"
        :key="index"
        no-body
        no-header
        class="flex-grow-1 border-0 shadow-sm rounded-lg m-2"
      >
        <div
          v-for="field in fieldSet"
          :key="field.id"
          class="p-2"
        >
          <div
            v-if="field.canReadRecordValue"
            class="value"
          >
            <field-editor
              v-if="field.canUpdateRecordValue && inEditing"
              :namespace="$attrs.namespace"
              :record="record"
              :field="field"
              :errors="fieldErrors(field.name)"
            />

            <div
              v-else
              class="mt-3 px-3"
            >
              <label class="text-primary">
                {{ field.label || field.name }}
              </label>
              <field-viewer
                :namespace="$attrs.namespace"
                :record="record"
                :field="field"
                value-only
              />
            </div>
          </div>
          <div
            v-else
            class="text-warning"
          >
            {{ $t('field.noPermission') }}
          </div>
        </div>
      </b-card>
    </main>
    <record-toolbar
      :module="module"
      :record="record"
      :processing="processing"
      :isDeleted="isDeleted"
      :inEditing="inEditing"
      @add="handleAdd()"
      @clone="handleClone()"
      @edit="handleEdit()"
      @delete="handleDelete()"
      @back="handleBack()"
      @submit="handleFormSubmitSimple('admin.modules.record.view')"
    />
  </div>
</template>

<script>
import FieldEditor from 'corteza-webapp-compose/src/components/ModuleFields/Editor'
import FieldViewer from 'corteza-webapp-compose/src/components/ModuleFields/Viewer'
import RecordToolbar from 'corteza-webapp-compose/src/components/Common/RecordToolbar'
import users from 'corteza-webapp-compose/src/mixins/users'
import record from 'corteza-webapp-compose/src/mixins/record'
import { compose } from '@cortezaproject/corteza-js'

export default {
  components: {
    RecordToolbar,
    FieldViewer,
    FieldEditor,
  },

  mixins: [
    // The record mixin contains all of the logic for creating/editing/deleting the record
    record,
    users,
  ],

  computed: {
    module () {
      if (this.$attrs.moduleID) {
        return this.getModuleByID(this.$attrs.moduleID)
      } else {
        return undefined
      }
    },

    fields () {
      if (!this.module) {
        // No module, no fields
        return []
      }

      const fields = []
      const fieldSetSize = 8
      const moduleFields = this.module.fields.slice().sort((a, b) => a.label.localeCompare(b.label))

      let i, j
      for (i = 0, j = moduleFields.length; i < j; i += fieldSetSize) {
        fields.push(moduleFields.slice(i, i + fieldSetSize))
      }

      return fields
    },

    getUiEventResourceType () {
      return 'admin-record-page'
    },
  },

  watch: {
    '$attrs.recordID': {
      immediate: true,
      handler () {
        this.loadRecord()
      },
    },
  },

  methods: {
    loadRecord () {
      if (this.$attrs.recordID && this.$attrs.moduleID) {
        const { namespaceID } = this.$attrs.namespace
        const { moduleID, recordID } = this.$attrs
        const module = Object.freeze(this.getModuleByID(moduleID).clone())
        this.$ComposeAPI
          .recordRead({ namespaceID, moduleID, recordID })
          .then(record => {
            this.record = new compose.Record(module, record)
            this.fetchUsers(this.module.fields, [this.record])
          })
          .catch(this.toastErrorHandler(this.$t('notification.record.loadFailed')))
      }
    },

    handleBack () {
      this.$router.push({ name: 'admin.modules.record.list', params: { moduleID: this.module.moduleID } })
    },

    handleAdd () {
      this.$router.push({ name: 'admin.modules.record.create', params: { moduleID: this.module.moduleID } })
    },

    handleClone () {
      this.$router.push({ name: 'admin.modules.record.create', params: { moduleID: this.module.moduleID, values: this.record.values } })
    },

    handleEdit () {
      this.$router.push({ name: 'admin.modules.record.edit', params: this.$route.params })
    },
  },
}
</script>

<style lang="scss">
.value {
  min-height: 1.2rem;
}
</style>

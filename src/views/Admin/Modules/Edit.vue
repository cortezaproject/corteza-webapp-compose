<template>
  <div class="py-3">
    <b-container @submit.prevent="handleSave" tag="form" v-if="module" fluid>
      <b-row no-gutters>
        <b-col xl="8" offset-xl="2">
          <b-card header-bg-variant="white"
                  no-body
                  header-class="border-bottom shadow-sm"
          >
            <div slot="header">
              <h1 class="mb-3">
                {{ $t('module.edit.title') }}
              </h1>
              <b-row no-gutters
                     class="align-items-end">
                <div class="flex-grow-1 text-nowrap">
                  <b-button
                    v-if="federationEnabled"
                    variant="light"
                    size="lg"
                    class="mr-1"
                    @click="federationSettings.modal = true"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'share-alt']"
                    />

                    {{ $t('module.edit.federationSettings.title') }}
                  </b-button>
                  <export :list="[this.module]"
                          type="module"
                          class="mr-1"
                  />

                  <c-permissions-button
                    v-if="module.canGrant"
                    :title="module.name"
                    :target="module.name"
                    :resource="`compose:module:${module.moduleID}`"
                    :buttonLabel="$t('general.label.permissions')"
                    buttonVariant="light"
                    class="btn-lg mr-1"
                  />

                  <c-permissions-button
                    v-if="module.canGrant"
                    resource="compose:module-field:*"
                    :buttonLabel="$t('module.edit.fieldPermissions')"
                    buttonVariant="light"
                    class="btn-lg ml-auto"
                  />
                </div>
                <div v-if="!creatingModule" class="flex-grow-1 text-nowrap d-flex justify-content-md-end mt-1">
                  <b-button
                    v-if="recordPage"
                    :disabled="!namespace.canManageNamespace"
                    :to="{ name: 'admin.pages.builder', params: { pageID: recordPage.pageID } }"
                    variant="light"
                    class="mr-1"
                    size="lg"
                  >
                    {{ $t('module.recordPage.edit') }}
                  </b-button>
                  <b-button
                    v-else
                    @click="handleRecordPageCreation"
                    variant="primary"
                    size="lg"
                    class="mr-1"
                  >
                    {{ $t('module.recordPage.create') }}
                  </b-button>
                </div>
              </b-row>
            </div>
            <b-container fluid class="px-4">
              <h5 class="my-3">{{ $t('module.edit.moduleInfo') }}</h5>
              <b-row>
                <b-col cols="12" md="6" xl="4">
                  <b-form-group>
                    <label class="text-primary">{{ $t('module.newLabel') }}</label>
                    <b-form-input required
                                  v-model="module.name"
                                  :placeholder="$t('module.newPlaceholder')"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="12" md="6" xl="4">
                <b-form-group>
                  <label class="text-primary">{{ $t('general.label.handle') }}</label>
                  <b-form-input v-model="module.handle"
                                :state="handleState"
                                class="mb-2"
                                :placeholder="$t('general.placeholder.handle')"></b-form-input>
                </b-form-group>
                </b-col>
              </b-row>
            </b-container>
            <hr>
            <b-container fluid class="px-4">
              <h5 class="mb-3 mt-1">{{ $t('module.edit.manageRecordFields') }}</h5>
              <b-row no-gutters>
                <b-form-group class="w-100">
                  <table class="table table-sm table-borderless table-responsive-lg">
                    <thead>
                    <tr>
                      <th></th>
                      <th v-b-tooltip.hover.topright :title="$t('module.edit.tooltip.name')" class="text-primary">{{ $t('general.label.name') }}</th>
                      <th v-b-tooltip.hover.topright :title="$t('module.edit.tooltip.title')" class="text-primary">{{ $t('general.label.title') }}</th>
                      <th class="text-primary">{{ $t('general.label.type') }}</th>
                      <th v-b-tooltip.hover :title="$t('module.edit.tooltip.attributes')" class="text-primary">{{ $t('general.label.attributes') }}</th>
                      <th></th>
                      <th v-if="false"></th>
                      <th></th>
                    </tr>
                    </thead>
                    <draggable v-model="module.fields" :options="{handle:'.handle'}" tag="tbody">
                      <field-row-edit v-for="(field, index) in module.fields"
                                      @edit="handleFieldEdit(module.fields[index])"
                                      @delete="module.fields.splice(index, 1)"
                                      v-model="module.fields[index]"
                                      :canGrant="namespace.canGrant"
                                      :hasRecords="hasRecords"
                                      :key="index"></field-row-edit>
                    </draggable>
                    <tr>
                      <td colspan="1" />
                      <td colspan="7">
                        <b-button @click="handleNewField"
                                  class="mb-5"
                                  variant="primary">
                          + {{ $t('module.edit.newField') }}
                        </b-button>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7"
                          class="font-weight-bold"
                      >
                        {{ $t('module.edit.systemFields') }}
                      </td>
                    </tr>
                    <field-row-view v-for="(field, index) in module.systemFields()"
                                    :field="field"
                                    class="mt-4"
                                    :key="index"></field-row-view>
                  </table>
                </b-form-group>
              </b-row>
            </b-container>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <b-modal
      v-if="updateField"
      :title="editModalTitle"
      :ok-title="$t('general.label.saveAndClose')"
      ok-only
      ok-variant="primary"
      size="lg"
      @ok="handleFieldSave(updateField)"
      @hide="updateField=null"
      :visible="!!updateField"
      body-class="p-0 border-top-0"
      header-class="p-3 pb-0 border-bottom-0">
      <field-configurator
        :field.sync="updateField"
        :namespace="namespace"
      />
    </b-modal>

    <federation-settings
      v-if="federationEnabled"
      :modal="federationSettings.modal"
      :module="module"
      @change="federationSettings.modal = ($event || false)"
    />

    <portal to="admin-toolbar">
      <editor-toolbar
        :back-link="{name: 'admin.modules'}"
        :hideDelete="hideDelete"
        :hideSave="hideSave"
        :disable-save="!fieldsValid || processing"
        @delete="handleDelete"
        @save="handleSave()"
        @saveAndClose="handleSave({ closeOnSuccess: true })"
      />
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import FieldConfigurator from 'corteza-webapp-compose/src/components/ModuleFields/Configurator'
import FieldRowEdit from 'corteza-webapp-compose/src/components/Admin/Module/FieldRowEdit'
import FieldRowView from 'corteza-webapp-compose/src/components/Admin/Module/FieldRowView'
import FederationSettings from 'corteza-webapp-compose/src/components/Admin/Module/FederationSettings'
import { compose, NoID } from '@cortezaproject/corteza-js'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'

export default {
  components: {
    draggable,
    FieldConfigurator,
    FieldRowEdit,
    FieldRowView,
    FederationSettings,
    EditorToolbar,
    Export,
  },

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    moduleID: {
      type: String,
      required: false,
      default: NoID,
    },
  },

  data () {
    return {
      updateField: null,
      module: new compose.Module(),
      hasRecords: false,
      processing: false,

      federationSettings: {
        modal: false,
      },
    }
  },

  computed: {
    ...mapGetters({
      pages: 'page/set',
    }),

    handleState () {
      return handleState(this.module.handle)
    },

    fieldsValid () {
      return this.module.fields.reduce((acc, f) => {
        // Allow, if any old fields are invalid (legacy support)
        if (f.fieldID !== '0') {
          return acc && true
        }

        return acc && f.isValid
      }, true)
    },

    editModalTitle () {
      if (!this.updateField) {
        return
      }

      const { name } = this.updateField
      return name ? this.$t('module.edit.specificFieldSettings', { name: this.updateField.name }) : this.$t('module.edit.moduleFieldSettings')
    },

    recordPage () {
      return this.pages.find(p => p.moduleID === this.moduleID)
    },

    recordListPage () {
      return this.pages.find(p => {
        return p.blocks.find(b => b.options.moduleID === this.moduleID)
      })
    },

    federationEnabled () {
      return !!this.$FederationAPI.baseURL && this.module.moduleID && !this.creatingModule
    },

    hideDelete () {
      return this.module.moduleID === NoID || !this.module.canDeleteModule
    },

    hideSave () {
      return this.module.moduleID !== NoID && !this.module.canUpdateModule
    },

    creatingModule () {
      return this.module.moduleID === NoID
    },
  },

  watch: {
    moduleID: {
      handler: function (moduleID) {
        if (moduleID === NoID) {
          this.module = new compose.Module(
            { fields: [new compose.ModuleFieldString({ fieldID: NoID, name: 'Sample' })] },
            this.namespace,
          )
        } else {
          this.findModuleByID({ namespace: this.namespace, moduleID: moduleID }).then((module) => {
            // Make a copy so that we do not change store item by ref
            this.module = module.clone()

            const { moduleID, namespaceID } = this.module

            // Count existing records to see what we can do with this module
            this.$ComposeAPI
              .recordList({ moduleID, namespaceID, limit: 1 })
              .then(({ set }) => { this.hasRecords = (set.length > 0) })
          })
        }
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
      updateModule: 'module/update',
      createModule: 'module/create',
      deleteModule: 'module/delete',
      createPage: 'page/create',
      updatePage: 'page/update',
    }),

    handleNewField () {
      this.module.fields.push(new compose.ModuleFieldString())
    },

    handleFieldEdit (field) {
      this.updateField = compose.ModuleFieldMaker({ ...field })
    },

    handleFieldSave (field) {
      const i = this.module.fields.findIndex(f => f.name === field.name)
      if (i > -1) {
        this.module.fields.splice(i, 1, field)
      }
    },

    handleFederationSettingsSave () {
      // @todo
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      this.processing = true

      if (this.module.moduleID === NoID) {
        this.createModule(this.module).then((module) => {
          this.module = new compose.Module({ ...module }, this.namespace)
          this.toastSuccess(this.$t('notification.module.saved'))
          if (closeOnSuccess) {
            this.redirect()
          } else {
            this.$router.push({ name: 'admin.modules.edit', params: { moduleID: this.module.moduleID } })
          }
        }).catch(this.toastErrorHandler(this.$t('notification.module.saveFailed')))
          .finally(() => {
            this.processing = false
          })
      } else {
        this.updateModule(this.module).then((module) => {
          this.module = new compose.Module({ ...module }, this.namespace)
          this.toastSuccess(this.$t('notification.module.saved'))
          if (closeOnSuccess) {
            this.redirect()
          }
        }).catch(this.toastErrorHandler(this.$t('notification.module.saveFailed')))
          .finally(() => {
            this.processing = false
          })
      }
    },

    handleDelete () {
      this.deleteModule(this.module).then(() => {
        this.toastSuccess(this.$t('notification.module.deleted'))
        this.$router.push({ name: 'admin.modules' })
      }).catch(this.toastErrorHandler(this.$t('notification.module.deleteFailed')))
    },

    async createDefaultPage (page = {}) {
      if (this.recordPage) {
        return this.recordPage
      }

      const { name, moduleID } = this.module
      const { namespaceID } = this.namespace

      return this.createPage({
        namespaceID,
        moduleID,

        title: `${this.$t('module.forModule.recordPage')} "${name || moduleID}"`,
        blocks: [],

        ...page,
      })
    },

    handleRecordPageCreation () {
      // A simple record block w/o preselected fields
      const blocks = [new compose.PageBlockRecord({ xywh: [0, 0, 12, 16] })]
      const selfID = (this.recordListPage || {}).pageID

      this.createDefaultPage({ blocks, selfID }).then(page => {
        this.$router.push({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }).catch(this.toastErrorHandler(this.$t('notification.page.createFailed')))
    },

    handleRecordListCreation () {
      this.createDefaultPage().then(recordPage => {
        const { namespaceID } = this.namespace
        const { name, moduleID } = this.module

        const recListBlock = new compose.PageBlockRecordList({
          xywh: [0, 0, 12, 16],
          options: {
            moduleID,
            pageID: recordPage.pageID,
            fields: [],
          },
        })

        const page = new compose.Page({
          title: `${this.$t('module.forModule.recordList')} "${name || moduleID}"`,
          namespaceID,
          blocks: [
            recListBlock,
          ],
        })

        this.createPage(page).then((page) => {
          this.$router.push({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
        })
      }).catch(this.toastErrorHandler(this.$t('notification.page.createFailed')))
    },

    redirect () {
      this.$router.push({ name: 'admin.modules' })
    },
  },
}
</script>

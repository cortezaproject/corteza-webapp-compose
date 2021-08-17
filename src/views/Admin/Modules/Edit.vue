<template>
  <div class="py-3">
    <portal to="topbar-title">
      {{ title }}
    </portal>

    <portal to="topbar-tools">
      <b-button-group
        v-if="allRecords"
        size="sm"
        class="mr-1"
      >
        <b-button
          v-if="allRecords"
          variant="primary"
          :disabled="!allRecords"
          :to="allRecords"
          class="d-flex align-items-center"
        >
          {{ $t('module.allRecords.label') }}
          <font-awesome-icon
            :icon="['fas', 'columns']"
            class="ml-2"
          />
        </b-button>
      </b-button-group>
    </portal>

    <b-container @submit.prevent="handleSave" tag="form" v-if="module" fluid="xl">
      <b-row no-gutters>
        <b-col>
          <b-card
            no-body
            class="shadow-sm"
          >
            <b-card-header
              header-bg-variant="white border-bottom"
              class="py-3"
            >
              <b-row
                no-gutters
                class="align-items-center"
              >
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
                    :resource="`corteza::compose:module/${namespace.namespaceID}/${module.moduleID}`"
                    :buttonLabel="$t('general.label.permissions')"
                    buttonVariant="light"
                    class="btn-lg mr-1"
                  />

                  <c-permissions-button
                    v-if="module.canGrant"
                    :resource="`corteza::compose:module-field/${namespace.namespaceID}/${module.moduleID}/*`"
                    :buttonLabel="$t('module.edit.fieldPermissions')"
                    buttonVariant="light"
                    class="btn-lg ml-auto mr-1"
                  />

                  <c-permissions-button
                    v-if="module.canGrant"
                    :resource="`corteza::compose:record/${namespace.namespaceID}/${module.moduleID}/*`"
                    :buttonLabel="$t('module.edit.recordPermissions')"
                    buttonVariant="light"
                    class="btn-lg ml-auto mr-1"
                  />

                </div>
                <div
                  v-if="!creatingModule"
                  class="flex-grow-1 text-nowrap d-flex justify-content-md-end"
                >
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
            </b-card-header>
            <b-container fluid class="px-4 pt-3">
              <h5 class="mb-3">{{ $t('module.edit.moduleInfo') }}</h5>
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
              <h5 class="mb-3">{{ $t('module.edit.manageRecordFields') }}</h5>
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
                                      :module="module"
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
      header-class="p-3 pb-0 border-bottom-0"
    >
      <field-configurator
        :field.sync="updateField"
        :namespace="namespace"
        :module="module"
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

    title () {
      return this.creatingModule ? this.$t('module.edit.create') : this.$t('module.edit.edit')
    },

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

    allRecords () {
      if (this.moduleID) {
        return { name: 'admin.modules.record.list', params: { moduleID: this.moduleID } }
      }

      return undefined
    },
  },

  watch: {
    moduleID: {
      handler: function (moduleID) {
        if (moduleID === NoID) {
          this.module = new compose.Module(
            { fields: [new compose.ModuleFieldString({ fieldID: NoID, name: this.$t('general.placeholder.sample') })] },
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

    handleSave ({ closeOnSuccess = false } = {}) {
      this.processing = true

      if (this.module.moduleID === NoID) {
        // Filter out record fields that reference this not yet created module
        let fields = []
        const toBeUpdatedFields = []
        this.module.fields.forEach(f => {
          if (f.kind === 'Record' && f.options.moduleID === '-1') {
            toBeUpdatedFields.push(f)
          } else {
            fields.push(f)
          }
        })

        // If such fields exist , after module is created add fields, map moduleID and update module
        // Unfortunately this ruins the initial field order, but we can improve this later
        this.createModule({ ...this.module, fields }).then(async module => {
          if (toBeUpdatedFields.length) {
            fields = [
              ...module.fields,
              ...toBeUpdatedFields.map(f => {
                f.options.moduleID = module.moduleID
                return f
              }),
            ]

            module = await this.updateModule({ ...module, fields })
          }

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
        this.updateModule(this.module).then(module => {
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

<template>
  <div class="py-3">
    <b-container @submit.prevent="handleSave" tag="form" v-if="module">
      <b-row>
        <b-col md="12">
          <b-card :title="$t('module.edit.title')" class="mb-5">
            <div slot="header" class="text-right">
              <export :list="[this.module]" type="module" />
              <c-permissions-button v-if="module.canGrant" resource="compose:module-field:*" link />
            </div>
            <b-form-group>
              <label>{{ $t('module.newPlaceholder') }}</label>
              <b-form-input required
                            v-model="module.name"
                            :placeholder="$t('module.newPlaceholder')"></b-form-input>
            </b-form-group>
            <b-form-group>
              <label>{{ $t('general.label.handle') }}</label>
              <b-form-input v-model="module.handle"
                            :state="handleState"
                            class="mb-2"
                            :placeholder="$t('general.placeholder.handle')"></b-form-input>
            </b-form-group>
            <b-form-group>
              <h5 class="mt-1">{{ $t('module.edit.manageRecordFields') }}</h5>
              <table class="table table-sm table-borderless">
                <thead>
                <tr>
                  <th></th>
                  <th v-b-tooltip.hover.topright :title="$t('module.edit.tooltip.name')" class="info">{{ $t('general.label.name') }}</th>
                  <th v-b-tooltip.hover.topright :title="$t('module.edit.tooltip.title')" class="info">{{ $t('general.label.title') }}</th>
                  <th>{{ $t('general.label.type') }}</th>
                  <th v-b-tooltip.hover :title="$t('module.edit.tooltip.multi')" class="info text-center">{{ $t('general.label.multi') }}</th>
                  <th v-b-tooltip.hover :title="$t('module.edit.tooltip.required')" class="info text-center">{{ $t('general.label.required') }}</th>
                  <th v-b-tooltip.hover :title="$t('module.edit.tooltip.private')" class="info text-center">{{ $t('general.label.private') }}</th>
                  <th></th>
                </tr>
                </thead>
                <draggable v-model="module.fields" :options="{handle:'.handle'}" element="tbody">
                  <field-row-edit v-for="(field, index) in module.fields"
                                  @edit="handleFieldEdit(module.fields[index])"
                                  @delete="module.fields.splice(index, 1)"
                                  v-model="module.fields[index]"
                                  :canGrant="namespace.canGrant"
                                  :hasRecords="hasRecords"
                                  :key="index"></field-row-edit>
                </draggable>
                <tr>
                  <th colspan="7">
                    <b-button @click="handleNewField"
                              variant="link">+ {{ $t('module.edit.newField') }}</b-button>
                  </th>
                </tr>
              </table>
              <div class="d-flex mt-5">
                <table class="w-50">
                  <tbody>
                    <tr>
                      <th colspan="7">{{ $t('module.edit.systemFields') }}</th>
                    </tr>
                    <field-row-view v-for="(field, index) in module.systemFields()"
                                    :field="field"
                                    :key="index"></field-row-view>
                  </tbody>
                </table>
                <div class="d-flex flex-column w-50">
                  <b-row align-v="center" class="text-center justify-content-between mt-4">
                    <b-col>
                      <circle-step
                        stepNumber="1"
                        :done="!!recordPage"
                        small>
                        <b-button
                          v-if="recordPage"
                          :disabled="!namespace.canManageNamespace"
                          :to="{ name: 'admin.pages.builder', params: { pageID: recordPage.pageID } }"
                          variant="outline-secondary"
                        >
                          {{ $t('module.edit.steps.recordPage') }}
                        </b-button>
                        <b-button
                          v-else
                          @click="handleRecordPageCreation"
                          variant="outline-secondary"
                        >
                          {{ $t('module.edit.steps.recordPage') }}
                        </b-button>
                      </circle-step>
                    </b-col>
                    <b-col>
                      <hr />
                    </b-col>
                    <b-col>
                      <circle-step
                        stepNumber="2"
                        :done="!!recordListPage"
                        small>
                        <b-button
                          v-if="recordListPage"
                          :disabled="!namespace.canManageNamespace"
                          :to="{ name: 'admin.pages.builder', params: { pageID: recordListPage.pageID } }"
                          variant="outline-secondary"
                        >
                          {{ $t('module.edit.steps.recordList') }}
                        </b-button>
                        <b-button
                          v-else
                          @click="handleRecordListCreation"
                          :disabled="!namespace.canCreatePage || !recordPage"
                          variant="outline-secondary">
                          {{ $t('module.edit.steps.recordList') }}
                        </b-button>
                      </circle-step>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </b-form-group>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-modal
      v-if="updateField"
      :title="modalTitle"
      :ok-title="$t('general.label.saveAndClose')"
      ok-only
      ok-variant="dark"
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
    <portal to="admin-toolbar">
      <editor-toolbar
        :back-link="{name: 'admin.modules'}"
        :hideDelete="!module.canDeleteModule"
        :hideSave="!module.canUpdateModule"
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
import { compose } from '@cortezaproject/corteza-js'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'
import CircleStep from 'corteza-webapp-compose/src/components/Common/CircleStep'

export default {
  components: {
    draggable,
    FieldConfigurator,
    FieldRowEdit,
    FieldRowView,
    EditorToolbar,
    Export,
    CircleStep,
  },

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    moduleID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      updateField: null,
      module: new compose.Module(),
      hasRecords: false,
      processing: false,
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

    modalTitle () {
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
  },

  created () {
    this.findModuleByID({ namespace: this.namespace, moduleID: this.moduleID }).then((module) => {
      // Make a copy so that we do not change store item by ref
      this.module = module.clone()

      // Count existing records to see what we can do with this module
      this.$ComposeAPI
        .recordList({ ...this.module, perPage: 1 })
        .then(({ filter }) => { this.hasRecords = (filter.count > 0) })
    })
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
      updateModule: 'module/update',
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
      this.updateModule(this.module).then((module) => {
        this.module = new compose.Module({ ...module }, this.namespace)
        this.raiseSuccessAlert(this.$t('notification.module.saved'))
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(this.defaultErrorHandler(this.$t('notification.module.saveFailed')))
        .finally(() => {
          this.processing = false
        })
    },

    handleDelete () {
      this.deleteModule(this.module).then(() => {
        this.raiseSuccessAlert(this.$t('notification.module.deleted'))
        this.$router.push({ name: 'admin.modules' })
      }).catch(this.defaultErrorHandler(this.$t('notification.module.deleteFailed')))
    },

    async createRecordPage (page = {}) {
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
      const recBlock = new compose.PageBlockRecord({ xywh: [0, 0, 12, 16] })

      this.createRecordPage({ blocks: [recBlock] }).then(page => {
        this.$router.push({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.createFailed')))
    },

    handleRecordListCreation () {
      this.createRecordPage().then(recordPage => {
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
      }).catch(this.defaultErrorHandler(this.$t('notification.page.createFailed')))
    },

    redirect () {
      this.$router.push({ name: 'admin.modules' })
    },
  },
}
</script>
<style lang="scss" scoped>
.steps {
  padding: 0;
  padding-top: 20vh;
}
</style>

<template>
  <div class="mt-3 w-100 pb-5 vh-100 overflow-auto flex-grow-1">
    <b-container @submit.prevent="handleSave" tag="form" v-if="module" class="pb-5">
      <b-row class="pb-5">
        <b-col md="12">
          <b-card :title="$t('module.edit.title')" class="mb-5">
            <div slot="header" class="text-right">
              <export :list="[this.module]" type="module" />
              <permissions-button v-if="module.canGrant" resource="compose:module-field:*" link />
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
                <tbody>
                  <tr>
                    <th colspan="7">{{ $t('module.edit.systemFields') }}</th>
                  </tr>
                  <field-row-view v-for="(field, index) in module.systemFields()"
                                  :field="field"
                                  :key="index"></field-row-view>
                </tbody>
              </table>
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
      header-class="px-3 pt-3 pb-0 border-bottom-0">
      <field-configurator :field.sync="updateField" />
    </b-modal>
    <editor-toolbar :back-link="{name: 'admin.modules'}"
                    :hideDelete="!module.canDeleteModule"
                    :hideSave="!module.canUpdateModule"
                    :disable-save="!fieldsValid"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
import FieldConfigurator from 'corteza-webapp-compose/src/lib/field/Configurator'
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'
import FieldRowEdit from 'corteza-webapp-compose/src/components/Admin/Module/FieldRowEdit'
import FieldRowView from 'corteza-webapp-compose/src/components/Admin/Module/FieldRowView'
import Field from 'corteza-webapp-compose/src/lib/field'
import Module from 'corteza-webapp-compose/src/lib/module'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'
import { RecordList } from 'corteza-webapp-compose/src/lib/block/RecordList'

export default {
  components: {
    ConfirmationToggle,
    draggable,
    FieldConfigurator,
    FieldRowEdit,
    FieldRowView,
    EditorToolbar,
    Export,
  },

  props: {
    namespace: {
      type: Object,
      required: false,
    },

    moduleID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      updateField: null,
      module: new Module(),
      hasRecords: false,
    }
  },

  computed: {
    handleState () {
      return handleState(this.module)
    },

    fieldsValid () {
      return this.module.fields.reduce((acc, f) => {
        const fv = f.fieldValid()

        // Allow, if any old fields are invalid (legacy support)
        if (f.fieldID !== '0') {
          return acc && true
        }

        return acc && fv
      }, true)
    },

    modalTitle () {
      if (!this.updateField) {
        return
      }

      const { name } = this.updateField
      return name ? this.$t('module.edit.specificFieldSettings', { name: this.updateField.name }) : this.$t('module.edit.moduleFieldSettings')
    },
  },

  created () {
    this.findModuleByID({ moduleID: this.moduleID }).then((module) => {
      // Make a copy so that we do not change store item by ref
      this.module = new Module({ ...module })
      const rl = new RecordList({ moduleID: this.module.moduleID })
      rl.fetch(this.$ComposeAPI, this.module, {}).then(({ records }) => {
        if (records.length > 0) {
          this.hasRecords = true
        }
      })
    })
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
      updateModule: 'module/update',
      deleteModule: 'module/delete',
    }),

    handleNewField () {
      this.module.fields.push(new Field({ kind: 'String' }))
    },

    handleFieldEdit (field) {
      this.updateField = new Field({ ...field })
    },

    handleFieldSave (field) {
      const i = this.module.fields.findIndex(f => f.name === field.name)
      if (i > -1) {
        this.module.fields.splice(i, 1, field)
      }
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      this.updateModule(this.module).then((module) => {
        this.module = new Module({ ...module })
        this.raiseSuccessAlert(this.$t('notification.module.saved'))
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(this.defaultErrorHandler(this.$t('notification.module.saveFailed')))
    },

    handleDelete () {
      this.deleteModule(this.module).then(() => {
        this.raiseSuccessAlert(this.$t('notification.module.deleted'))
        this.$router.push({ name: 'admin.modules' })
      }).catch(this.defaultErrorHandler(this.$t('notification.module.deleteFailed')))
    },

    redirect () {
      this.$router.push({ name: 'admin.modules' })
    },
  },
}
</script>

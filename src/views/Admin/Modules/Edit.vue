<template>
  <div class="scrollable">
    <form @submit.prevent="handleSave" class="container" v-if="module">
      <div class="row">
        <div class="col-md-12 well">
        <h2>{{ $t('module.edit.title') }}</h2>
          <div class="form-group">
            <label>{{ $t('module.newPlaceholder') }}</label>
            <input required type="text" v-model="module.name" class="form-control" :placeholder="$t('module.newPlaceholder')" />
          </div>
          <div class="form-group">
            <h5>{{ $t('module.edit.manageRecordFields') }}</h5>
            <table class="table">
              <thead>
              <tr>
                <th></th>
                <th v-b-tooltip.hover.topright :title="$t('module.edit.tooltip.name')" class="info">{{ $t('general.label.name') }}</th>
                <th v-b-tooltip.hover.topright :title="$t('module.edit.tooltip.title')" class="info">{{ $t('general.label.title') }}</th>
                <th>{{ $t('general.label.type') }}</th>
                <th v-b-tooltip.hover :title="$t('module.edit.tooltip.required')" class="info">{{ $t('general.label.required') }}</th>
                <th v-b-tooltip.hover :title="$t('module.edit.tooltip.sensitive')" class="info">{{ $t('general.label.sensitive') }}</th>
                <th class="text-center"></th>
              </tr>
              </thead>
              <draggable v-model="module.fields" :options="{handle:'.handle'}" element="tbody">
                <field-row-edit v-for="(field, index) in module.fields"
                                @edit="handleFieldEdit(field)"
                                @delete="module.fields.splice(index, 1)"
                                :field="field"
                                :key="index"></field-row-edit>
              </draggable>
              <tr>
                <th colspan="7">
                  <button @click="handleNewField" type="button" class="btn-url add-new">+ {{ $t('module.edit.newField') }}</button>
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
          </div>
        </div>
      </div>
    </form>
    <b-modal
      v-if="updateField"
      :title="$t('module.edit.moduleFieldSettings')"
      :ok-title="$t('general.label.saveAndClose')"
      ok-variant="dark"
      ok-only
      @ok="handleFieldSave(updateField)"
      @hide="updateField=null"
      :visible="!!updateField">
      <field-configurator :field.sync="updateField" />
    </b-modal>
    <editor-toolbar :back-link="{name: 'admin.modules'}"
                    :hideDelete="!module.canDeleteModule"
                    :hideSave="!chart.canUpdateModule"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
import FieldConfigurator from '@/lib/field/Configurator'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import FieldRowEdit from '@/components/Admin/Module/FieldRowEdit'
import FieldRowView from '@/components/Admin/Module/FieldRowView'
import Field from '@/lib/field'
import Module from '@/lib/module'
import EditorToolbar from '@/components/Admin/EditorToolbar'

export default {
  components: {
    ConfirmationToggle,
    draggable,
    FieldConfigurator,
    FieldRowEdit,
    FieldRowView,
    EditorToolbar,
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
    }
  },

  created () {
    this.findModuleByID({ moduleID: this.moduleID }).then((module) => {
      // Make a copy so that we do not change store item by ref
      this.module = new Module({ ...module })
    })
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
      updateModule: 'module/update',
      deleteModule: 'module/delete',
    }),

    handleNewField () {
      this.module.fields.push(new Field())
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
        this.module = module
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

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

/* stylelint-disable font-family-no-missing-generic-family-keyword */

table {
  th, td {
    padding: 3px;
    vertical-align: middle;
  }

  th {
    cursor: default;

    &.info {
      min-width: 50px;

      &::after {
        font-family: $icomoon-font-family;
        content: "\ea0c";
        padding-left: 3px;
        font-weight: 300;
        color: $appgrey;
      }
    }
  }
}

.btn-url {
  margin-left: 10px;

  &.add-new {
    display: block;
    margin: 10px 35px 20px;
  }
}

h5 {
  margin-top: 40px;
}
</style>

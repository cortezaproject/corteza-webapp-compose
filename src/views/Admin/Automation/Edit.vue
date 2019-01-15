<template>
  <div>
    <editor-toolbar :back-link="{name: 'admin.automation'}"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
    <form @submit.prevent="handleSave" class="container" v-if="trigger">
      <div class="row">
        <div class="col-md-12 well">
          <h2>Automation</h2>
          <b-form-group horizontal
                        label="Name">
            <b-form-input v-model="trigger.name"
                          require
                          placeholder="Automation name"></b-form-input>
          </b-form-group>

          <b-form-group horizontal>
            <b-form-checkbox v-model="trigger.enabled"
                             :value="true"
                             plain
                             :unchecked-value="false">Enabled</b-form-checkbox>
          </b-form-group>

          <b-form-group horizontal
                        label="Code">
            <AceEditor :value="trigger.source"
                       :fontSize="14"
                       :showPrintMargin="false"
                       :showGutter="true"
                       :highlightActiveLine="true"
                       :enableBasicAutocompletion="true"
                       :minLines="10"
                       :maxLines="30"
                       width="100%"
                       :editorProps="{$blockScrolling: true}"
                       :onChange="onSourceEditorChange"
                       :onBeforeLoad="onBeforeSourceEditorLoad"
                       :onLoad="onSourceEditorLoad"
                       mode="javascript"
                       theme="monokai"
                       ref="sourceEditor"
                       name="editor" />

            <br>
            Sample code:
            <b-button-group>
              <b-button variant="link" @click="insertSample('SimpleFieldValueCheck')">Value check</b-button>
              <b-button variant="link" @click="insertSample('MakeNewRecord')">New record</b-button>
              <b-button variant="link" @click="insertSample('SimpleNotification')">UI Notification</b-button>
              <b-button variant="link" @click="insertSample('SimpleEmailNotification')">Email notification</b-button>
            </b-button-group>
            <b-button class="float-right" variant="link" @click="insertSample('Default', true)">Reset</b-button>
          </b-form-group>

          <b-form-group horizontal
                        label="Primary module">
            <b-form-select v-model="trigger.moduleID"
                           :options="modules"
                           text-field="name"
                           required
                           value-field="moduleID"
                           class="form-control">
              <template slot="first"><option :value="null">(no primary module)</option></template>
            </b-form-select>
          </b-form-group>

          <b-form-group horizontal
                        label="Actions that trigger the automation ...">
            <b-form-checkbox-group plain v-model="trigger.actions" stacked>
              <b-form-checkbox value="manual">manually, when user clicks a button on a page</b-form-checkbox>
              <b-form-checkbox value="beforeCreate">before record is created</b-form-checkbox>
              <b-form-checkbox value="afterCreate">after record is created</b-form-checkbox>
              <b-form-checkbox value="beforeUpdate">before record is updated</b-form-checkbox>
              <b-form-checkbox value="afterUpdate">after record is updated</b-form-checkbox>
              <b-form-checkbox value="beforeDelete">before record is deleted</b-form-checkbox>
              <b-form-checkbox value="afterDelete">after record is deleted</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Trigger from '@/lib/trigger'
import * as TriggerCodeSamples from '@/assets/triggers/samples'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import { Ace as AceEditor } from 'vue2-brace-editor'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import EditorToolbar from '@/components/Admin/EditorToolbar'

export default {
  props: {
    triggerID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      editor: null,
      trigger: null,
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),
  },

  created () {
    this.findTriggerByID({ triggerID: this.triggerID }).then((t) => {
      this.trigger = new Trigger(t)
    })
  },

  methods: {
    ...mapActions({
      findTriggerByID: 'trigger/findByID',
      updateTrigger: 'trigger/update',
      deleteTrigger: 'trigger/delete',
    }),

    handleSave ({ closeOnSuccess = false } = {}) {
      this.updateTrigger(this.trigger).then(() => {
        this.raiseSuccessAlert('Trigger saved')
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(this.defaultErrorHandler('Could not save this trigger'))
    },

    handleDelete () {
      this.deleteTrigger(this.trigger).then(() => {
        this.raiseSuccessAlert('Trigger deleted')
        this.redirect()
      }).catch(this.defaultErrorHandler('Could not delete this trigger'))
    },

    onSourceEditorChange (value) {
      this.trigger.source = value
    },

    onBeforeSourceEditorLoad (brace) {
      // const langTools = brace.acequire('ace/ext/language_tools')
      //
      // langTools.addCompleter({
      //   getCompletions: (editor, session, pos, prefix, callback) => {
      //     console.log(editor, session, pos, prefix, callback)
      //   },
      // })
    },

    onSourceEditorLoad (brace) {
      // Disable linting, we do not care about missing end semicolon warnings
      brace.session.$worker.send('changeOptions', [{ asi: true }])

      // Link brace to component's data so we have access to it later
      this.editor = brace

      // Add default sample to unconfigured triggers
      if (!this.trigger.moduleID && !this.trigger.source) {
        this.insertSample('Default')
      }
    },

    insertSample (key, reset = false) {
      if (reset) {
        this.editor.session.setValue(TriggerCodeSamples[key])
      } else {
        this.editor.session.insert(this.editor.getCursorPosition(), TriggerCodeSamples[key])
      }
    },

    redirect () {
      this.$router.push({ name: 'admin.automation' })
    },
  },

  components: {
    ConfirmationToggle,
    AceEditor,
    EditorToolbar,
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

label {
  margin-left: 5px;
}

.table {
  td {
    border-top: 0;
  }
}

.btn {
  border-radius: 0;
}

</style>

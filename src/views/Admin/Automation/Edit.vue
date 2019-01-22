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

          <b-form-group horizontal>
            <b-button-group>
              <b-button variant="link" @click="insertSample('LeadConversion')">Lead conversion example</b-button>
            </b-button-group>
            <b-button class="float-right" variant="link" @click="insertSample('Default', true)">Reset</b-button>
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
        <div class="col-md-12 well">
          <b-form-group horizontal
                        label="Testing trigger"
                        description="When trigger has primary module selected, record ID is needed for tests to run properly.<br />
                                     Changes to records are ignored if not explicity saved (through crust.api.record.save/delete)">
            <b-input-group>
              <b-input-group-text slot="prepend">Record ID</b-input-group-text>
              <b-form-input v-model="test.recordID"
                            :state="testRecordIDState"
                            :disabled="!trigger.moduleID"></b-form-input>
              &nbsp;&nbsp;
              <b-button @click.prevent="onRun"
                        :disabled="testRecordIDState === false">Run test</b-button>
            </b-input-group>
          </b-form-group>
        </div>
        <div class="col-md-12 well">
          <h2>Record Automation Manual</h2>
          <h3>Trigger logic and behaviour</h3>
          <h4>Manual triggers</h4>
          <p>
            Enabled triggers with "manual" action checked can be added to pages
            into automation blocks. When adding triggers to record pages, trigger's
            primary module must match page's.
          </p>

          <h4>Before* triggers</h4>
          <p>
            Automation triggers that fire before creation, update or deletion of a record can prevent that action.
            If error/exception is thrown (<code>throw new Exception('Some error')</code>) or <i>non true</i>
            value is returned (<code>return false;</code>) main action is canceled and record is not created,
            modified or deleted
          </p>

          <h4>After* triggers</h4>
          <p>
            These events do not have an effect on the main action and are not executed if main action failed (or if
            before* trigger failed.)
          </p>
          <p>
            After create and update triggers receive updated record.
          </p>

          <h4>Trigger filtering and order of execution</h4>
          <p>
            Triggers filtered by action (manual, before/after create/update/delete), their status (enabled/disabled)
            and module compatibility. Triggers without primary module are always execututed (if all other
            conditions are met).
          </p>
          <p>
            In case of multiple trigger match, order of execution can not be guaranteed. Errors that occur inside a
            specific trigger do not affect other triggers executing at the same time
          </p>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Trigger from '@/lib/trigger'
import Record from '@/lib/record'
import * as TriggerCodeSamples from '@/assets/triggers/samples'
import triggerRunner from '@/mixins/trigger_runner'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import { Ace as AceEditor } from 'vue2-brace-editor'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import EditorToolbar from '@/components/Admin/EditorToolbar'
import RecordField from '@/lib/field/Editor/Record'

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
      test: {
        recordID: null,
      },
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    testRecordIDState () {
      if (!this.trigger.moduleID || !this.test.recordID) {
        return null
      }

      return /^\d+$/.test(this.test.recordID)
    },
  },

  created () {
    this.findTriggerByID({ triggerID: this.triggerID }).then((t) => {
      this.trigger = new Trigger(t)
    })
  },

  methods: {
    ...mapActions({
      findTriggerByID: 'trigger/findByID',
      findModuleByID: 'module/findByID',
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

    onRun () {
      this.run()
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

    run () {
      const ctx = {
        record: undefined,
        module: undefined,
      }

      // Original promise is simple, just return
      // default, empty context
      let p = Promise.resolve(ctx)

      if (this.trigger.moduleID) {
        if (!this.test.recordID) {
          this.raiseWarningAlert('Primary module set, expecting valid recordID')
          return
        }

        // When primary module is set and there is a valid record present,
        // override the promise, preload module & record
        p = this.findModuleByID({ moduleID: this.trigger.moduleID })
          .then(m => {
            // Set loaded module to context
            ctx.module = m

            // And load record from the given params
            return this.$crm.moduleRecordRead({ moduleID: m.moduleID, recordID: this.test.recordID })
          })
          .then(r => {
            // Properly convert record and update context
            ctx.record = new Record(ctx.module, r)
            return ctx
          })
      }

      p.then(ctx => {
        // Whatever the context & promise are, continue and run the trigger.
        this.trigger
          .run(this.triggerContext(ctx))
          .catch(this.defaultErrorHandler('An error occurred while executing the trigger (see browser console for details)'))
          .then(() => this.raiseSuccessAlert('Trigger successfully executed'))
      })
    },
  },

  components: {
    ConfirmationToggle,
    AceEditor,
    EditorToolbar,
    RecordField,
  },

  mixins: [
    triggerRunner,
  ],
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

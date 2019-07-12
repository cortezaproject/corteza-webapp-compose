<template>
  <div class="mt-3">
    <b-container @submit.prevent="handleSave" tag="form" v-if="trigger" class="pb-5">
      <b-row>
        <b-col md="12" class="mb-1">
          <b-card :title="$t('trigger.edit.title')">
            <export :list="[trigger]" type="trigger" class="float-right" slot="header"/>
            <b-form-group horizontal
                          :label="$t('trigger.edit.nameLabel')">
              <b-form-input v-model="trigger.name"
                            require
                            :placeholder="$t('trigger.edit.namePlaceholder')"></b-form-input>
            </b-form-group>
            <b-form-group horizontal>
              <b-form-checkbox v-model="trigger.enabled"
                               :value="true"
                               plain
                               :unchecked-value="false">{{ $t('trigger.edit.enabled') }}</b-form-checkbox>
            </b-form-group>
            <b-form-group horizontal
                          :label="$t('trigger.edit.primaryModule.label')">
              <b-form-select v-model="trigger.moduleID"
                             :options="modules"
                             text-field="name"
                             required
                             value-field="moduleID"
                             class="form-control">
                <template slot="first"><option :value="null">{{ $t('trigger.edit.primaryModule.none') }}</option></template>
              </b-form-select>
            </b-form-group>
            <b-form-group horizontal>
              <b-button-group>
                <b-button variant="outline-dark" @click="insertSample('LeadConversion')">{{ $t('trigger.edit.loadExampleConversion') }}</b-button>
              </b-button-group>
              <b-button class="float-right" variant="outline-dark" @click="insertSample('Default', true)">{{ $t('trigger.edit.reset') }}</b-button>
            </b-form-group>
            <b-form-group horizontal
                          :label="$t('trigger.edit.codeLabel')">
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
                          :label="$t('trigger.triggerCondition.label')">
              <b-form-checkbox-group plain v-model="trigger.actions" stacked>
                <b-form-checkbox value="manual">{{ $t('trigger.triggerCondition.manual') }}</b-form-checkbox>
                <b-form-checkbox value="beforeCreate">{{ $t('trigger.triggerCondition.beforeCreate') }}</b-form-checkbox>
                <b-form-checkbox value="afterCreate">{{ $t('trigger.triggerCondition.afterCreate') }}</b-form-checkbox>
                <b-form-checkbox value="beforeUpdate">{{ $t('trigger.triggerCondition.beforeUpdate') }}</b-form-checkbox>
                <b-form-checkbox value="afterUpdate">{{ $t('trigger.triggerCondition.afterUpdate') }}</b-form-checkbox>
                <b-form-checkbox value="beforeDelete">{{ $t('trigger.triggerCondition.beforeDelete') }}</b-form-checkbox>
                <b-form-checkbox value="afterDelete">{{ $t('trigger.triggerCondition.afterDelete') }}</b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
          </b-card>
        </b-col>
        <b-col md="12" class="mb-1">
          <b-card>
            <b-form-group horizontal
                          :label="$t('trigger.testing.label')"
                          :description="`${$t('trigger.testing.footnotePrimaryModule')}<br />${$t('trigger.testing.footnoteRecordChanges')}`">
              <b-input-group>
                <b-input-group-text slot="prepend">{{ $t('trigger.testing.recordID') }}</b-input-group-text>
                <b-form-input v-model="test.recordID"
                              :state="testRecordIDState"
                              :disabled="!trigger.moduleID"></b-form-input>
                <b-button @click.prevent="onRun"
                          variant="dark"
                          :disabled="testRecordIDState === false">{{ $t('trigger.testing.run') }}</b-button>
              </b-input-group>
            </b-form-group>
          </b-card>
        </b-col>
        <b-col md="12">
          <b-card class="mb-5">
            <div id="trigger-manual" class="mb-5 text-justify" v-html="manualFromMd($t('trigger.manual', { joinArrays: '\n' }))"></div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <editor-toolbar :back-link="{name: 'admin.automation'}"
                    :hideDelete="!trigger.canDeleteTrigger"
                    :hideSave="!trigger.canUpdateTrigger"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Trigger from 'corteza-webapp-compose/src/lib/trigger'
import Record from 'corteza-webapp-compose/src/lib/record'
import * as TriggerCodeSamples from 'corteza-webapp-compose/src/triggers/samples'
import triggerRunner from 'corteza-webapp-compose/src/mixins/trigger_runner'
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'
import { Ace as AceEditor } from 'vue2-brace-editor'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import RecordField from 'corteza-webapp-compose/src/lib/field/Editor/Record'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'

const md = require('markdown-it')('commonmark')

export default {
  components: {
    ConfirmationToggle,
    AceEditor,
    EditorToolbar,
    RecordField,
    Export,
  },

  mixins: [
    triggerRunner,
  ],

  props: {
    triggerID: {
      type: String,
      required: true,
    },

    namespace: {
      type: Object,
      required: false,
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

    manualFromMd () {
      return (mdRaw) => md.render(mdRaw)
    },

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
      this.updateTrigger(this.trigger).then((trigger) => {
        this.trigger = trigger
        this.raiseSuccessAlert(this.$t('notification.automation.saved'))
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(this.defaultErrorHandler(this.$t('notification.automation.saveFailed')))
    },

    handleDelete () {
      this.deleteTrigger(this.trigger).then(() => {
        this.raiseSuccessAlert(this.$t('notification.automation.deleted'))
        this.redirect()
      }).catch(this.defaultErrorHandler(this.$t('notification.automation.deleteFailed')))
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
          this.raiseWarningAlert(this.$t('notification.automation.invalidRecordID'))
          return
        }

        // When primary module is set and there is a valid record present,
        // override the promise, preload module & record
        p = this.findModuleByID({ moduleID: this.trigger.moduleID })
          .then(m => {
            // Set loaded module to context
            ctx.module = m
            const { namespaceID, moduleID } = m

            // And load record from the given params
            return this.$ComposeAPI.recordRead({ namespaceID, moduleID, recordID: this.test.recordID })
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
          .catch(this.defaultErrorHandler(this.$t('notification.automation.execFailed')))
          .then(() => this.raiseSuccessAlert(this.$t('notification.automation.executed')))
      })
    },
  },
}
</script>

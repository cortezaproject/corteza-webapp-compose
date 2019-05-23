<template>
  <div class="scrollable">
    <form @submit.prevent="handleSave" class="container" v-if="trigger">
      <div class="row">
        <div class="col-md-12 well mb-1">
          <h2>{{ $t(`automation.edit.title`) }}</h2>
          <b-form-group horizontal
                        :label="$t(`automation.edit.nameLabel`)">
            <b-form-input v-model="trigger.name"
                          require
                          :placeholder="$t(`automation.edit.namePlaceholder`)"></b-form-input>
          </b-form-group>

          <b-form-group horizontal>
            <b-form-checkbox v-model="trigger.enabled"
                             :value="true"
                             plain
                             :unchecked-value="false">{{ $t(`automation.edit.enabled`) }}</b-form-checkbox>
          </b-form-group>

          <b-form-group horizontal
                        :label="$t(`automation.edit.primaryModule.label`)">
            <b-form-select v-model="trigger.moduleID"
                           :options="modules"
                           text-field="name"
                           required
                           value-field="moduleID"
                           class="form-control">
              <template slot="first"><option :value="null">{{ $t(`automation.edit.primaryModule.none`) }}</option></template>
            </b-form-select>
          </b-form-group>

          <b-form-group horizontal>
            <b-button-group>
              <b-button variant="outline-dark" @click="insertSample('LeadConversion')">{{ $t(`automation.edit.loadExampleConversion`) }}</b-button>
            </b-button-group>
            <b-button class="float-right" variant="outline-dark" @click="insertSample('Default', true)">{{ $t(`automation.edit.reset`) }}</b-button>
          </b-form-group>

          <b-form-group horizontal
                        :label="$t('automation.edit.codeLabel')">
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
                        :label="$t('automation.triggerCondition.label')">
            <b-form-checkbox-group plain v-model="trigger.actions" stacked>
              <b-form-checkbox value="manual">{{ $t(`automation.triggerCondition.manual`) }}</b-form-checkbox>
              <b-form-checkbox value="beforeCreate">{{ $t(`automation.triggerCondition.beforeCreate`) }}</b-form-checkbox>
              <b-form-checkbox value="afterCreate">{{ $t(`automation.triggerCondition.afterCreate`) }}</b-form-checkbox>
              <b-form-checkbox value="beforeUpdate">{{ $t(`automation.triggerCondition.beforeUpdate`) }}</b-form-checkbox>
              <b-form-checkbox value="afterUpdate">{{ $t(`automation.triggerCondition.afterUpdate`) }}</b-form-checkbox>
              <b-form-checkbox value="beforeDelete">{{ $t(`automation.triggerCondition.beforeDelete`) }}</b-form-checkbox>
              <b-form-checkbox value="afterDelete">{{ $t(`automation.triggerCondition.afterDelete`) }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </div>
        <div class="col-md-12 well mb-1">
          <b-form-group horizontal
                        :label="$t('automation.testing.label')"
                        :description="`${$t('automation.testing.footnotePrimaryModule')}<br />${$t('automation.testing.footnoteRecordChanges')}`">
            <b-input-group>
              <b-input-group-text slot="prepend">{{ $t('automation.testing.recordID') }}</b-input-group-text>
              <b-form-input v-model="test.recordID"
                            :state="testRecordIDState"
                            :disabled="!trigger.moduleID"></b-form-input>
              <b-button @click.prevent="onRun"
                        variant="dark"
                        :disabled="testRecordIDState === false">{{ $t('automation.testing.run') }}</b-button>
            </b-input-group>
          </b-form-group>
        </div>
        <div id="automation-manual" class="col-md-12 manual well text-justify" v-html="manualFromMd($t(`automation.manual`, { joinArrays: '\n' }))"></div>

      </div>
    </form>
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

const md = require('markdown-it')('commonmark')

export default {
  components: {
    ConfirmationToggle,
    AceEditor,
    EditorToolbar,
    RecordField,
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
            return this.$compose.recordRead({ namespaceID, moduleID, recordID: this.test.recordID })
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
<style lang="scss" scoped>
.manual {
  margin-bottom: 100px;
}
</style>

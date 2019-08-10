<template>
  <div class="mt-3 mb-4" v-if="script">
    <b-container @submit.prevent="handleSave" tag="form" class="pb-5">
      <b-row>
        <b-col md="12" class="mb-1">
          <b-card :title="$t('automation.edit.title')">
            <export :list="[script]" type="script" class="float-right" slot="header"/>

            <b-tabs v-model="activeTab">
              <b-tab :title="$t('automation.edit.settingsTabLabel')">
                <b-form class="m-3">
                  <b-form-group horizontal
                                :label="$t('automation.edit.nameLabel')">
                    <b-form-input v-model="script.name"
                                  require
                                  :placeholder="$t('automation.edit.namePlaceholder')"></b-form-input>
                  </b-form-group>
                  <b-form-group horizontal>
                    <b-form-checkbox v-model="script.critical" checked @change="onCriticalChange">
                      {{ $t('automation.edit.criticalLabel') }}
                      <b-form-text>{{ $t('automation.edit.criticalHelp') }}</b-form-text>
                    </b-form-checkbox>
                    <b-form-checkbox v-model="script.async" :disabled="script.critical">
                      {{ $t('automation.edit.asyncLabel') }}
                      <b-form-text>{{ $t('automation.edit.asyncHelp') }}</b-form-text>
                    </b-form-checkbox>
                    <b-form-checkbox v-model="script.runInUA">
                      {{ $t('automation.edit.runInUALabel') }}
                      <b-form-text>{{ $t('automation.edit.runInUAHelp') }}</b-form-text>
                    </b-form-checkbox>
                    <b-form-checkbox v-model="script.enabled" checked>
                      {{ $t('automation.edit.enabledLabel') }}
                      <b-form-text>{{ $t('automation.edit.enabledHelp') }}</b-form-text>
                    </b-form-checkbox>
                    {{ script.checked }}
                  </b-form-group>
                  <b-form-group horizontal
                                :label="$t('automation.edit.timeoutLabel')">
                    <b-form-input type="number"
                                  number
                                  :placeholder="$t('automation.edit.timeoutPlaceholder')"
                                  v-model="script.timeout"></b-form-input>
                    <b-form-text>{{ $t('automation.edit.timeoutHelp') }}</b-form-text>
                  </b-form-group>
                </b-form>
              </b-tab>
              <b-tab :title="$t('automation.edit.codeTabLabel')">
                <AceEditor :value="script.source"
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
              </b-tab>
              <b-tab :title="$t('automation.edit.scheduledTriggers.tabLabel')" v-if="false">
                @todo intervals & deferred
              </b-tab>
              <b-tab :title="$t('automation.edit.recordTriggers.tabLabel', [countEnabledRecordTriggers])" :disabled="modules.length === 0">
                <the-record-triggers class="mt-3"
                                     :modules="modules"
                                     :triggers.sync="triggers" />
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <editor-toolbar :back-link="{name: 'admin.automation'}"
                    :hideDelete="!script.canDelete"
                    :hideSave="!script.canUpdate"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import AutomationTrigger from 'corteza-webapp-common/src/lib/types/shared/automation-trigger'
import * as TriggerCodeSamples from 'corteza-webapp-compose/src/triggers/samples'
import triggerRunner from 'corteza-webapp-compose/src/mixins/ui-script-runner'
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'
import { Ace as AceEditor } from 'vue2-brace-editor'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'
import TheRecordTriggers from 'corteza-webapp-compose/src/components/Admin/Automation/TheRecordTriggers'

export default {
  components: {
    TheRecordTriggers,
    ConfirmationToggle,
    AceEditor,
    EditorToolbar,
    Export,
  },

  mixins: [
    triggerRunner,
  ],

  props: {
    scriptID: {
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
      activeTab: 2,

      editor: null,
      script: null,
      triggers: [],
      test: {
        recordID: null,
      },
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    countEnabledRecordTriggers () {
      return this.triggers.reduce((v, t) => { return v + (t.isValid() ? 1 : 0) }, 0)
    },
  },

  created () {
    const { namespaceID } = this.namespace
    this.findScriptByID({ namespaceID, scriptID: this.scriptID }).then((s) => {
      this.script = s
      return this.loadTriggers()
    }).catch(this.defaultErrorHandler(this.$t('notification.automation.loadFailed')))
  },

  methods: {
    ...mapActions({
      findScriptByID: 'automationScript/findByID',
      updateScript: 'automationScript/update',
      deleteScript: 'automationScript/delete',
    }),

    async loadTriggers () {
      const p = {
        namespaceID: this.namespace.namespaceID,
        scriptID: this.scriptID,
        incDeleted: true,
        perPage: 0,
      }

      this.triggers = []
      return this.$ComposeAPI.automationTriggerList(p).then(({ set, filter }) => {
        this.triggers = set.map(t => new AutomationTrigger(t))
        console.log(this.triggers)
      })
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      const { namespaceID } = this.namespace
      this.updateScript({ namespaceID, ...this.script, triggers: this.triggers }).then((script) => {
        this.script = script
        this.raiseSuccessAlert(this.$t('notification.automation.saved'))
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(this.defaultErrorHandler(this.$t('notification.automation.saveFailed')))
    },

    handleDelete () {
      const { namespaceID } = this.namespace
      this.deleteTrigger({ namespaceID, ...this.script }).then(() => {
        this.raiseSuccessAlert(this.$t('notification.automation.deleted'))
        this.redirect()
      }).catch(this.defaultErrorHandler(this.$t('notification.automation.deleteFailed')))
    },

    onRun () {
      this.run()
    },

    triggerComponent (t) {
      switch (t.event) {
        case 'manual':
        case 'deferred':
        case 'interval':
          return `trigger-${t.event}`
        default:
          return `trigger-event`
      }
    },

    onSourceEditorChange (value) {
      this.script.source = value
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
      if (!this.script.moduleID && !this.script.source) {
        this.insertSample('Default')
      }
    },

    onCriticalChange () {
      if (this.script.critical) {
        this.script.async = false
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

    // run () {
    //   const ctx = {
    //     record: undefined,
    //     module: undefined,
    //   }
    //
    //   // Original promise is simple, just return
    //   // default, empty context
    //   let p = Promise.resolve(ctx)
    //
    //   if (this.script.moduleID) {
    //     if (!this.test.recordID) {
    //       this.raiseWarningAlert(this.$t('notification.automation.invalidRecordID'))
    //       return
    //     }
    //
    //     // When primary module is set and there is a valid record present,
    //     // override the promise, preload module & record
    //     p = this.findModuleByID({ moduleID: this.script.moduleID })
    //       .then(m => {
    //         // Set loaded module to context
    //         ctx.module = m
    //         const { namespaceID, moduleID } = m
    //
    //         // And load record from the given params
    //         return this.$ComposeAPI.recordRead({ namespaceID, moduleID, recordID: this.test.recordID })
    //       })
    //       .then(r => {
    //         // Properly convert record and update context
    //         ctx.record = new Record(ctx.module, r)
    //         return ctx
    //       })
    //   }
    //
    //   p.then(ctx => {
    //     // Whatever the context & promise are, continue and run the script.
    //     this.script
    //       .run(this.scriptContext(ctx))
    //       .catch(this.defaultErrorHandler(this.$t('notification.automation.execFailed')))
    //       .then(() => this.raiseSuccessAlert(this.$t('notification.automation.executed')))
    //   })
    // },
  },
}
</script>

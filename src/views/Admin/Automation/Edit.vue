<template>
  <div class="mt-3 mb-4" v-if="script">
    <b-container @submit.prevent="handleSave" tag="form" class="pb-5">
      <b-row>
        <b-col md="12" class="mb-1">
          <b-card :title="$t('automation.edit.title')">
            <!-- <export :list="[script]" type="script" class="float-right" slot="header"/> -->

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
                    <b-form-checkbox v-model="script.enabled" checked>
                      {{ $t('automation.edit.enabledLabel') }}
                      <b-form-text>{{ $t('automation.edit.enabledHelp') }}</b-form-text>
                    </b-form-checkbox>
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

                  </b-form-group>

                  <b-form-group horizontal
                                :label="$t('automation.edit.timeoutLabel')">
                    <b-input-group>
                      <b-form-input type="number"
                                    number
                                    min="0"
                                    max="60000"
                                    trim
                                    :placeholder="$t('automation.edit.timeoutPlaceholder')"
                                    v-model="script.timeout"></b-form-input>
                      <b-input-group-append><b-input-group-text>ms</b-input-group-text></b-input-group-append>
                    </b-input-group>
                    <b-form-text>{{ $t('automation.edit.timeoutHelp') }}</b-form-text>
                  </b-form-group>

                  <b-form-group horizontal
                                v-if="canModifySecurty"
                                :label="$t('automation.edit.securityLabel')">
                    <vue-select :options="users"
                                :reduce="u => u.userID"
                                @search="onUserSearch"
                                label="email"
                                :key="script.runAs"
                                :disabled="script.runInUA"
                                :placeholder="$t('automation.edit.userPickerPlaceholder')"
                                v-model="script.runAs"></vue-select>
                    <b-form-text>{{ $t('automation.edit.runAsHelp') }}</b-form-text>
                    <b-button @click="preloadRunner($auth.user.userID)">{{ $t('automation.edit.runAsCurrentUser', { user: $auth.user.name || $auth.user.email }) }}</b-button>
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
                           :editorProps="{$blockScrolling: true}"
                           :onChange="onSourceEditorChange"
                           :onBeforeLoad="onBeforeSourceEditorLoad"
                           :onLoad="onSourceEditorLoad"
                           width="100%"
                           mode="javascript"
                           theme="monokai"
                           name="scriptSource"/>

                <b-row class="mt-3">
                  <b-col cols="6">{{ $t('automation.testing.parametersHeadline') }}</b-col>
                  <b-col cols="6">{{ $t('automation.testing.resultsHeadline') }}</b-col>
                </b-row>

                <b-row class="mt-1">
                  <b-col cols="6">
                    <vue-select :options="modules"
                                :reduce="m => m.moduleID"
                                label="name"
                                :key="testModuleID"
                                :placeholder="$t('automation.testing.modulePickerPlaceholder')"
                                v-model="testModuleID"></vue-select>
                  </b-col>
                  <b-col cols="6">
                    <b-button-group>
                      <b-button type="button"
                                @click="onClickRunTestInCorredor"
                                :variant="script.runInUA ? 'link':'primary'">{{ $t('automation.testing.testInCorredor') }}</b-button>
                      <b-button type="button"
                                @click="onClickRunTestInBrowser"
                                :variant="script.runInUA ? 'primary':'link'">{{ $t('automation.testing.testInBrowser') }}</b-button>
                    </b-button-group>
                  </b-col>
                </b-row>
                <b-row class="mt-1">
                  <b-col cols="6">
                    <div v-if="testPayloadErr">
                      <b-button variant="link" class="float-right" @click="testPayloadErr=null">Clear error</b-button>
                      <pre class="text-danger">{{ testPayloadErr }}</pre>
                    </div>
                    <AceEditor v-else
                               :value="testPayload"
                               :fontSize="14"
                               :showPrintMargin="false"
                               :showGutter="true"
                               :highlightActiveLine="true"
                               :enableBasicAutocompletion="true"
                               :minLines="20"
                               :maxLines="20"
                               :onChange="onTestRecordEditorChange"
                               width="100%"
                               mode="json"
                               theme="monokai"
                               name="testPayload" />
                  </b-col>
                  <b-col cols="6">
                    <div v-if="testResponseErr">
                      <pre class="text-danger">{{ testResponseErr }}</pre>
                    </div>
                    <AceEditor v-else
                               :value="testResponse"
                               :fontSize="14"
                               :showPrintMargin="false"
                               :showGutter="true"
                               :highlightActiveLine="false"
                               :enableBasicAutocompletion="false"
                               :minLines="20"
                               :maxLines="20"
                               :readOnly="true"
                               width="100%"
                               mode="json"
                               theme="monokai"
                               name="testResponse"/>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="6">
                    <b-input-group>
                      <b-input-group-text>{{ $t('automation.testing.recordPreloadText') }}</b-input-group-text>
                      <b-input v-model="testPayloadID"
                               :disabled="!testModuleID"
                               type="number"
                               :placeholder="$t('automation.testing.recordID')" />
                      <b-button type="button"
                                :disabled="!testModuleID || !testPayloadID"
                                @click="onLoadTestRecord"
                                variant="primary">{{ $t('automation.testing.load') }}</b-button>
                    </b-input-group>
                  </b-col>
                  <b-col cols="6">
                    <div><i18next path="automation.testing.warning" /></div>
                  </b-col>
                </b-row>
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
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { VueSelect } from 'vue-select'
import Module from 'corteza-webapp-compose/src/lib/module'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import execInUA from 'corteza-webapp-common/src/lib/automation-scripts/exec-in-ua'
import AutomationTrigger from 'corteza-webapp-common/src/lib/types/shared/automation-trigger'
import uiScriptRunner from 'corteza-webapp-compose/src/mixins/ui-script-runner'
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'
import { Ace as AceEditor } from 'vue2-brace-editor'
import 'brace/mode/javascript'
import 'brace/mode/json'
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
    VueSelect,
  },

  mixins: [
    uiScriptRunner,
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
      activeTab: 0,

      editor: null,
      script: null,
      triggers: [],

      users: [],

      testModuleID: null,
      testPayloadID: null,
      testPayload: `{"record":{}}`,
      testResponse: '',
      testPayloadErr: null,
      testResponseErr: null,
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
      pages: 'page/set',
      getModuleByID: 'module/getByID',
    }),

    countEnabledRecordTriggers () {
      return this.triggers.reduce((v, t) => { return v + (t.isValid() ? 1 : 0) }, 0)
    },

    canModifySecurty () {
      return (this.script.scroptID && this.script.canGrant) || this.namespace.canGrant
    },
  },

  created () {
    const { namespaceID } = this.namespace
    this.findScriptByID({ namespaceID, scriptID: this.scriptID }).then((s) => {
      this.script = s
      this.preloadRunner(s.runAs)
      return this.loadTriggers()
    }).then(() => {
      // Make script writer's life easeier
      // and preselect module from first valid trigger
      for (let { enabled = true, condition } of this.triggers) {
        if (enabled && condition !== '0') {
          this.testModuleID = condition
          break
        }
      }
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
      })
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      const { namespaceID } = this.namespace

      if (!this.script.runAs) {
        this.script.runAs = '0'
      }

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

    /**
     *
     * @param {string} query
     * @param {function} loading
     */
    onUserSearch (query, loading) {
      if (query.length > 2) {
        loading(true)
        this.userSearch(this, query, loading)
      }
    },

    userSearch: _.debounce((vm, query, loading) => {
      vm.$SystemAPI.userList({ query }).then(({ set }) => {
        vm.users = set
        loading(false)
      })
    }),

    preloadRunner (userID) {
      if (userID) {
        // We need to trick <v-select> component into re-rendering when
        // we find the selected runner/user
        this.script.runAs = ''

        this.$SystemAPI.userRead({ userID }).then((u) => {
          this.users.push(u)

          // Set the value back and force <v-select> to re-render
          this.script.runAs = userID
        })
      }
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

    // Brace editor does not support v-model
    onSourceEditorChange (source) {
      this.script.source = source
    },

    // Brace editor does not support v-model
    onTestRecordEditorChange (testPayloadPayload) {
      this.testPayload = testPayloadPayload
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
    },

    onCriticalChange () {
      if (this.script.critical) {
        this.script.async = false
      }
    },

    onLoadTestRecord () {
      this.$ComposeAPI.recordRead({
        namespaceID: this.namespace.namespaceID,
        moduleID: this.testModuleID,
        recordID: this.testPayloadID,
      }).then(record => {
        this.testPayloadErr = null
        this.testPayload = JSON.stringify({ record }, null, '  ')
      }).catch(err => {
        this.testPayload = null
        this.testPayloadErr = err
      })
    },

    onClickRunTestInBrowser () {
      const ctx = {
        ComposeAPI: this.$ComposeAPI,
        MessagingAPI: this.$MessagingAPI,
        SystemAPI: this.$SystemAPI,

        namespace: this.namespace,
        module: this.testModuleID ? new Module(this.getModuleByID(this.testModuleID)) : undefined,
        ...this.parseTestPayload(),
      }

      // We must convert the record struct from payload to something usable:
      if (ctx.module && ctx.record) {
        ctx.record = new Record(ctx.module, ctx.record)
      }

      // Override stuff that might hurt our testing/dev environment:
      ctx.routePusher = (params) => { console.log('routePusher', params) }
      ctx.emitter = (name, params) => { console.log(name, params) }
      ctx.pages = this.pages

      execInUA(this.script.source, ctx).then(rval => {
        this.testResponseErr = null

        if (rval instanceof Record) {
          rval = {
            record: {
              ...rval,
              module: undefined,
              values: rval.serializeValues(),
            },
          }
        }

        this.testResponse = JSON.stringify(rval, null, '  ')
      }).catch(err => {
        console.error(err)
        this.testResponseErr = err
        this.testResponse = null
      })
    },

    onClickRunTestInCorredor () {
      const payload = {
        source: this.script.source,
        namespaceID: this.namespace.namespaceID,
        moduleID: this.testModuleID,
        ...this.parseTestPayload(),
      }

      this.$ComposeAPI.automationScriptTest(payload).then(rval => {
        this.testResponseErr = null
        this.testResponse = JSON.stringify(rval, null, '  ')
      }).catch(err => {
        if (err.message) {
          err = err.message
        }

        this.testResponseErr = err
        this.testResponse = null
      })
    },

    parseTestPayload () {
      if (this.testPayload) {
        try {
          return JSON.parse(this.testPayload)
        } catch ({ message }) {
          this.raiseWarningAlert(`Could not parse payload JSON: ${message}.`)
          return false
        }
      }

      return {}
    },

    redirect () {
      this.$router.push({ name: 'admin.automation' })
    },
  },
}
</script>

import { compose } from '@cortezaproject/corteza-js'

export default {
  methods: {
    async TriggerManualScriptOnComposeRecord ({ script, bundle }, { record, module, namespace }) {
      if (bundle) {
        // @todo implement
        throw new Error('pending implementation')
        // Exec(
        //   // or wherever we'll store client scripts
        //   undefined, // <-- how/where do we store client scripts?
        //   { record, module, namespace },
        //   console,
        //   undefined // <- config
        // )
      } else {
        const { recordID, values } = record
        const { moduleID } = module
        const { namespaceID } = namespace
        return this.$ComposeAPI.recordTriggerScript({ script, values, recordID, moduleID, namespaceID }).then(r => new compose.Record(module, r))
      }
    },

    async TriggerManualScriptOnComposeModule ({ script, bundle }, { module, namespace }) {
      if (bundle) {
        // @todo implement
        throw new Error('pending implementation')
        // Exec(
        //   // or wherever we'll store client scripts
        //   undefined, // <-- how/where do we store client scripts?
        //   { module, namespace },
        //   console,
        //   undefined // <- config
        // )
      } else {
        const { moduleID } = module
        const { namespaceID } = namespace
        this.$ComposeAPI.moduleTriggerScript({ script, moduleID, namespaceID })
      }
    },

    async TriggerManualScriptOnComposeNamespace ({ script, bundle }, { namespace }) {
      if (bundle) {
        // @todo implement
        throw new Error('pending implementation')
        // Exec(
        //   // or wherever we'll store client scripts
        //   undefined, // <-- how/where do we store client scripts?
        //   { module, namespace },
        //   console,
        //   undefined // <- config
        // )
      } else {
        const { namespaceID } = namespace
        this.$ComposeAPI.namespaceTriggerScript({ script, namespaceID })
      }
    },

    async TriggerManualScriptOnComposePage ({ script, bundle }, { page }) {
      if (bundle) {
        // @todo implement
        throw new Error('pending implementation')
        // Exec(
        //   // or wherever we'll store client scripts
        //   undefined, // <-- how/where do we store client scripts?
        //   { module, page },
        //   console,
        //   undefined // <- config
        // )
      } else {
        const { pageID } = page
        this.$ComposeAPI.pageTriggerScript({ script, pageID })
      }
    },

    async TriggerManualScriptOnCompose ({ script, bundle }) {
      if (bundle) {
        // @todo implement
        throw new Error('pending implementation')
        // Exec(
        //   // or wherever we'll store client scripts
        //   undefined, // <-- how/where do we store client scripts?
        //   { module, page },
        //   console,
        //   undefined // <- config
        // )
      } else {
        this.$ComposeAPI.automationTriggerScript({ script })
      }
    },
  },
}

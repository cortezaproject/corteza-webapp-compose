<template>
  <b-form ref="importForm" @submit.prevent class="import-form">
    <b-form-group :label="$t(`${type}.import`)">
      <b-form-file>
        <input @change="loadFile" type="file"/>
          <b-input-group-append>
            <b-button
              v-if="importObj && !processing"
              variant="dark"
              @click="openModal">{{ $t('general.label.import') }}</b-button>
            <b-button
              v-if="importObj && processing"
              variant="dark"
              @click="cancelImport">{{ $t('general.label.cancel') }}</b-button>
          </b-input-group-append>
        <h5 v-if="processing" class="ml-2 mt-1 mb-0">
          {{ $t('general.label.processing') }}
        </h5>
      </b-form-file>
    </b-form-group>
    <b-modal v-if="importObj" size="lg" v-model="show" id="importModal">
      <div slot="modal-title">
        <div>
          <h5>{{ $t(`${type}.import`) }}</h5>
          <b-button
              variant="secondary"
              pill
              @click="selectAll(true)">{{ $t('field.selector.selectAll') }}</b-button>
          <b-button
              class="ml-2"
              variant="secondary"
              pill
              @click="selectAll(false)">{{ $t('field.selector.unselectAll') }}</b-button>
        </div>
      </div>
      <div v-for="(o, index) in importObj.list" :key="`${o.name || o.title}-${index}`" class="form-check">
        <label class="form-check-label" :for="`${o.name || o.title}-${index}`">
          <input type="checkbox" :true-value="true" :false-value="false" class="form-check-input"  v-model="o.import" :id="`${o.name || o.title}-${index}`">
          {{ o.name || o.title }}
        </label>
      </div>
      <div slot="modal-footer">
        <b-button
            :disabled="!importObj.list.filter(i => i.import).length > 0"
            variant="primary"
            @click="jsonImport(importObj)">{{ $t('general.label.import') }}</b-button>
      </div>
    </b-modal>
  </b-form>
</template>

<script>
import { mapGetters } from 'vuex'
import Trigger from 'corteza-webapp-compose/src/lib/trigger'
import Chart from 'corteza-webapp-compose/src/lib/chart'
import Module from 'corteza-webapp-compose/src/lib/module'

export default {
  props: {
    namespace: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      importObj: null,
      importErr: null,
      processing: false,
      show: false,
      classes: {
        'module': Module,
        'chart': Chart,
        'trigger': Trigger,
      },
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),
  },

  methods: {
    async jsonImport ({ list, type }) {
      this.processing = true
      this.show = false
      const { namespaceID } = this.namespace
      const ItemClass = this.classes[type]
      try {
        for (let item of list.filter(i => i.import)) {
          if (this.importObj) {
            item = new ItemClass(item).import(this.getModuleID)
            item.namespaceID = namespaceID
            await this.$store.dispatch(`${this.type}/create`, item)
          } else {
            break
          }
        }
        this.raiseSuccessAlert(this.$t('notification.import.successful'))
      } catch (e) {
        this.raiseWarningAlert(this.$t(`notification.import.failed`))
      }
      this.cancelImport()
    },

    getModuleID (moduleName) {
      // find module, replaceID
      const matchedModules = this.modules.filter(m => m.name === moduleName)
      if (matchedModules.length > 0) {
        return matchedModules[0].moduleID
      } else {
        return null
      }
    },

    selectAll (selectAll) {
      this.importObj.list = this.importObj.list.map(i => {
        i.import = selectAll && true
        return i
      })
    },

    openModal () {
      if (this.importObj.type === this.type) {
        this.show = true
      } else {
        this.raiseWarningAlert(this.$t('notification.import.typeMissmatch', { type1: this.importObj.type, type2: this.type }))
        this.importObj = null
      }
    },

    cancelImport () {
      this.importObj = null
      this.processing = false
      this.$refs.importForm.reset()
    },

    loadFile (e) {
      var file = e.target.files[0]
      if (file) {
        this.processing = true
        var reader = new FileReader()
        reader.readAsText(file)
        reader.onload = (evt) => {
          try {
            this.importObj = JSON.parse(evt.target.result)
            this.importObj.list = this.importObj.list.map(i => {
              return { import: true, ...i }
            })
          } catch (err) {
            this.raiseWarningAlert(err.message)
          } finally {
            this.processing = false
          }
        }
        reader.onerror = (evt) => {
          this.raiseWarningAlert(this.$t('notification.import.errorReading'))
          this.processing = false
        }
      }
    },
  },
}
</script>

<template>
  <form ref="importForm" @submit.prevent class="import-form">
    <b-form-group :label="$t('block.recordList.import')">
      <b-input-group>
        <input @change="loadFile" type="file" class="input-file" />
        <b-button
              v-if="records && !processing"
              variant="secondary"
              @click="show = true">{{ $t('general.label.import') }}</b-button>
        <b-button
              v-if="records && processing"
              variant="secondary"
              @click="cancelImport">{{ $t('general.label.cancel') }}</b-button>
        <h5 v-if="processing" class="ml-2 mt-1 mb-0">
          {{ $t('general.label.processing') }}
        </h5>
      </b-input-group>
    </b-form-group>
    <b-modal size="lg" v-model="show" :title="$t('block.recordList.import')" id="importModal" scrollable>
      <label for="columns">
        {{ $t('block.recordList.chooseColumns', { target: $t('general.label.import')}) }}
        <div class="form-group" id="columns">
          <b-button
              variant="secondary"
              @click="selectAll(true)">{{ $t('field.selector.selectAll') }}</b-button>
          <b-button
              class="ml-2"
              variant="secondary"
              @click="selectAll(false)">{{ $t('field.selector.unselectAll') }}</b-button>
        </div>
        <div class="row m-0">
          <div v-for="(c, index) in importColumns" :key="index" class="form-check col-4">
            <label class="form-check-label" :for="index">
              <input type="checkbox" :true-value="true" :false-value="false" class="form-check-input"  v-model="c.import" :id="index">
                {{ c.name }}
            </label>
          </div>
        </div>
      </label>
      <div slot="modal-footer">
          <b-button
              :disabled="!importColumns.filter(c => c.import).length > 0"
              variant="primary"
              @click="importRecords()">{{ $t('general.label.import') }}</b-button>
      </div>
    </b-modal>
  </form>
</template>

<script>
import triggerRunner from '@/mixins/trigger_runner'
import Record from '@/lib/record'

export default {
  mixins: [
    triggerRunner,
  ],

  props: {
    module: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      importColumns: [],
      records: null,
      importErr: null,
      processing: false,
      show: false,
    }
  },

  methods: {
    importRecords () {
      this.processing = true
      try {
        this.records.forEach(async r => {
          let record = new Record(this.module, {})
          for (let p of this.importColumns) {
            if (p.import) {
              record.values[p.name] = r[p.name]
            }
          }
          await this.$compose.recordCreate(record).then(nr => {
            console.log(nr)
          })
        })
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
      this.importColumns = this.importColumns.map(i => {
        i.import = selectAll && true
        return i
      })
    },

    cancelImport () {
      this.show = false
      this.records = null
      this.processing = false
      this.$refs.importForm.reset()
    },

    loadFile (e) {
      const file = e.target.files[0]
      if (file) {
        this.processing = true
        const ext = file.name.split('.').pop()
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = (evt) => {
          try {
            if (ext === 'csv') {
              const parsedCSV = this.$papa.parse(evt.target.result).data
              if (parsedCSV.length > 0) {
                this.importColumns = parsedCSV[0].map(c => { return { import: true, name: c } })
                this.records = []
                for (let i = 1; i < parsedCSV.length; i++) {
                  let obj = {}
                  for (let j = 0; j < this.importColumns.length; j++) {
                    obj[this.importColumns[j].name] = parsedCSV[i][j]
                  }
                  this.records.push(obj)
                }
              }
            } else if (ext === 'jsonl') {
              this.records = evt.target.result.split('\n').map(o => JSON.parse(o))
              if (this.records.length > 0) {
                this.importColumns = Object.keys(this.records[0]).map(c => { return { import: true, name: c } })
              }
            } else {
              this.raiseWarningAlert(this.$t('notification.import.formatNotSupported'))
            }
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

<style lang="scss" scoped>
.form-check {
  line-height: 24px;
  font-size: 17px;
}
</style>

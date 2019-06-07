<template>
  <form ref="exportForm" @submit.prevent class="export-form">
    <b-button variant="link" class="p-0" @click="prepareExport">
      {{ $t('general.label.export') }}
    </b-button>
    <b-modal size="lg" v-model="show" :title="$t('block.recordList.export')" id="exportModal" scrollable>
      <div class="form-group">
        <label for="format">
          {{ $t('block.recordList.pickFormat') }}
          <b-form-radio-group
            v-model="selectedFormat"
            :options="formatOptions"
            button-variant="primary-outline"
            name="radio-inline" />
        </label>
      </div>
      <label for="columns">
        {{ $t('block.recordList.chooseColumns') }}
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
          <div v-for="c in exportColumns" :key="c.fieldID" class="form-check col-4">
            <label class="form-check-label" :for="c.fieldID">
              <input type="checkbox" :true-value="true" :false-value="false" class="form-check-input"  v-model="c.export" :id="c.fieldID">
              {{ c.name }}
            </label>
          </div>
        </div>
      </label>
      <div slot="modal-footer">
          <b-button
              :disabled="!exportColumns.filter(c => c.export).length > 0"
              variant="primary"
              @click="startExport">{{ $t('general.label.export') }}</b-button>
          <download-csv class="invisible" :data="getExportData" ref="downloadCSV"/>
      </div>
    </b-modal>
  </form>
</template>

<script>
import { saveAs } from 'file-saver'
import JsonCSV from 'vue-json-csv'

export default {
  components: {
    'download-csv': JsonCSV,
  },

  props: {
    params: {
      type: Object,
      required: true,
    },

    columns: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      records: [],
      exportColumns: [],
      exportData: [],
      formatOptions: [
        { text: '.csv', value: 'csv' },
        { text: 'JSON Lines', value: 'jsonl' },
      ],
      selectedFormat: 'csv',
      readyToExport: false,
      show: false,
    }
  },

  computed: {
    getExportData () {
      return this.exportData
    },
  },

  methods: {
    selectAll (selectAll) {
      this.exportColumns = this.exportColumns.map(c => {
        c.export = selectAll && true
        return c
      })
    },

    prepareExport () {
      this.records = this.exportColumns = this.exportData = []
      this.params.count = 0
      this.params.perPage = 999999999
      this.params.page = 0
      this.$compose.recordList(this.params).then(({ filter, set }) => {
        this.records = set.map(r => r.values)
      }).catch(this.defaultErrorHandler(this.$t('notification.record.listLoadFailed')))
      this.exportColumns = this.columns.map(c => {
        return { fieldID: c.fieldID, name: c.name, export: true }
      })
      this.show = true
    },

    startExport () {
      this.show = false
      const exportColumns = this.exportColumns.filter(c => c.export)
      this.exportData = this.records.map(r => {
        let crtObj = {}
        for (let { name } of exportColumns) {
          let matchedValues = r.filter(v => v.name === name)
          if (matchedValues.length > 0) {
            crtObj[name] = matchedValues[0].value
          } else {
            crtObj[name] = ''
          }
        }
        return crtObj
      })
      if (this.selectedFormat === 'csv') {
        this.$refs.downloadCSV.data = this.getExportData
        this.$refs.downloadCSV.$el.click()
      } else if (this.selectedFormat === 'jsonl') {
        let blob = new Blob([this.getExportData.map((o, index) => JSON.stringify(o)).join('\n')], { type: 'application/json' })
        saveAs(blob, `record-export.jsonl`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.form-check {
  font-size: 15px;
  line-height: 24px;
}

.invisible {
  display: none;
}
</style>

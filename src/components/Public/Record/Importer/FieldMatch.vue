<template>
  <b-card header-bg-variant="white"
          footer-bg-variant="white">

    <b-form-group>
      <div class="mb-4">
        <label>
          {{ $t('block.recordList.import.matchFields') }}
        </label>
        <br />
        <small
          v-if="hasRequiredFileField"
          class="text-danger"
        >
          {{ $t('block.recordList.import.hasRequiredFileFields') }}
        </small>
      </div>

      <b-table small
               :fields="tableFields"
               :items="rows"
               class="field-table">

        <template v-slot:head(selected)>
          <b-form-checkbox class="pr-0"
                           :checked="selectAll"
                           @change="onSelectAll" />
        </template>

        <template v-slot:cell(selected)="data">

          <b-form-checkbox class="pr-0"
                           v-model="data.item.selected" />
        </template>

        <template v-slot:cell(moduleField)="data">

          <b-form-select v-model="data.item.moduleField"
                         :options="moduleFields">

            <template slot="first">
              <option :value="undefined"
                      disabled>

                {{ $t('block.recordList.import.pickModuleField') }}
              </option>
            </template>
          </b-form-select>
        </template>
      </b-table>
    </b-form-group>

    <div slot="footer">
      <b-button variant="outline-dark"
                @click="$emit('back')"
                class="float-left">

        {{ $t('general.label.back') }}
      </b-button>

      <b-button variant="dark"
                :disabled="!canContinue"
                @click="nextStep"
                class="float-right">

        {{ $t('general.label.import') }}
      </b-button>
    </div>
  </b-card>
</template>

<script>
export default {
  props: {
    session: {
      type: Object,
      required: true,
      default: () => ({}),
    },

    module: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data () {
    return {
      rows: [],
      unsupportedFields: [],
    }
  },

  computed: {
    // @note don't use selectAll directly as v-model, since it fires
    // when ever data changes, eaven by this getter.
    // Above onSelectAll doesn't fire if getter changes
    selectAll: {
      get () {
        // if all rows selected
        return this.rows.reduce((acc, { selected }) => acc && selected, true)
      },

      set (v) {
        // set all rows to what this one is set to
        this.rows.forEach((r) => { r.selected = v })
      },
    },

    canContinue () {
      // has anything selected && all selected rows have mapped module fields
      const selected = this.rows.filter(({ selected }) => selected)
      const named = selected.filter(({ moduleField }) => !!moduleField)
      return !!selected.length && selected.length === named.length
    },

    tableFields () {
      return [
        { key: 'selected', label: '', tdClass: 'picker' },
        { key: 'fileColumn', label: this.$t('block.recordList.import.fileColumns') },
        { key: 'moduleField', label: this.$t('block.recordList.import.moduleFields') },
      ]
    },

    moduleFields () {
      return this.module.fields
        .filter(({ kind }) => !['User', 'Record', 'File'].includes(kind))
        .map(({ name: value, label: text }) => ({ value, text }))
        .sort((a, b) => a.text.localeCompare(b.text))
    },

    hasRequiredFileField () {
      return !!this.module.fields.find(({ kind, isRequired }) => kind === 'File' && isRequired)
    },
  },

  created () {
    // Prep row object for us to alter
    const { fields = {} } = this.session
    const moduleFields = {}
    this.module.fields.forEach(({ name }) => {
      moduleFields[name] = name
    })

    this.rows = Object.entries(fields)
      .map(([fileColumn, moduleField]) => ({
        selected: false,
        fileColumn,
        moduleField: moduleField || moduleFields[fileColumn],
      }))
  },

  methods: {
    nextStep () {
      if (!this.canContinue) {
        return
      }

      // convert to api's structure
      const rtr = {}
      this.rows.forEach(({ selected, fileColumn, moduleField }) => {
        if (selected) {
          rtr[fileColumn] = moduleField
        }
      })

      this.$emit('fieldsMatched', rtr)
    },

    onSelectAll (e) {
      this.selectAll = e
    },
  },

}
</script>

<style lang="scss" scoped>
/deep/.picker {
  width: 30px;
}

.field-table /deep/ th {
  padding-bottom: 10px;
}

</style>

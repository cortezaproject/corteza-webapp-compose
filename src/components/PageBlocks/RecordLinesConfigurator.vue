<template>
  <b-tab :title="$t('block.recordLines.label')">
    <b-form-group
      :label="$t('block.general.module')"
    >
      <b-form-select v-model="options.moduleID" required>
        <option value="0">{{ $t('general.label.none') }}</option>
        <option
          v-for="module in availableModules"
          :key="module.moduleID"
          :value="module.moduleID">

          {{ module.name }}
        </option>
      </b-form-select>
      <b-form-text class="text-secondary small">
        {{ $t('block.recordLines.module.footnote') }}
      </b-form-text>
    </b-form-group>

    <div
      v-if="!!options.moduleID && relatedModule"
    >
      <hr>
      <b-form-group
        v-if="relatedModule"
        :label="$t('block.recordLines.fields.label')"
        label-size="lg"
      >
        <field-picker
          :module="relatedModule"
          :fields.sync="fields"
        />
      </b-form-group>

      <b-form-group
        v-if="relatedModule && fields.length > 0"
        :label="$t('block.recordLines.editFields.label')"
        label-size="lg"
        class="mb-0"
      >
        <field-picker
          :module="relatedModule"
          :field-subset="fields.filter(f => !f.isSystem)"
          :fields.sync="options.editFields"
          disable-system-fields
        />
      </b-form-group>

      <b-form-group
        horizontal
        :label-cols="3"
        breakpoint="md"
        :label="$t('block.recordLines.parentField.label')"
      >
        <b-form-select
          v-model="options.parentField"
          required
        >
          <option :value="undefined">
            {{ $t('general.label.none') }}
          </option>
          <option
            v-for="field in parentFields"
            :key="field.fieldID"
            :value="field.name">

            {{ field.name }}
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">
          {{ $t('block.recordLines.parentField.footnote') }}
        </b-form-text>
      </b-form-group>

      <b-form-group
        horizontal
        :label-cols="3"
        breakpoint="md"
        :label="$t('block.recordLines.positionField.label')"
        class="mb-0"
      >
        <b-form-select v-model="options.positionField">
          <option :value="undefined">
            {{ $t('general.label.none') }}
          </option>
          <option
            v-for="field in positionFields"
            :key="field.fieldID"
            :value="field.name">

            {{ field.label || field.name }}
          </option>
        </b-form-select>
        <b-form-text class="text-secondary small">
          {{ $t('block.recordLines.positionField.footnote') }}
        </b-form-text>
      </b-form-group>
    </div>
  </b-tab>
</template>
<script>
import { mapGetters } from 'vuex'
import base from './base'
import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'
import { NoID } from '@cortezaproject/corteza-js'

export default {
  name: 'RecordLines',

  components: {
    FieldPicker,
  },

  extends: base,

  data () {
    return {
      availableModules: [],

      fields: [],
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    relatedModule () {
      if (this.options.moduleID !== NoID) {
        return this.$store.getters['module/getByID'](this.options.moduleID)
      } else {
        return undefined
      }
    },

    parentFields () {
      if (this.relatedModule) {
        return this.relatedModule.fields.filter(({ kind, isMulti, options }) => {
          if (kind === 'Record' && !isMulti) {
            return options.moduleID === this.record.moduleID
          }
        })
      }
      return []
    },

    positionFields () {
      if (this.relatedModule) {
        return this.relatedModule.fields.filter(({ kind, isMulti }) => kind === 'Number' && !isMulti)
      }
      return []
    },
  },

  watch: {
    'options.moduleID' () {
      // Every time moduleID changes
      this.fields = []
      this.options.editFields = []
      this.options.viewFields = []
      const f = this.relatedModule.fields.find(({ kind, options: { moduleID } }) => kind === 'Record' && moduleID === this.module.moduleID)
      this.options.parentField = f ? f.name : undefined
      this.options.positionField = undefined
    },

    fields () {
      this.options.viewFields = this.fields.filter(f => !this.options.editFields.find(({ name }) => name === f.name))
      this.options.editFields = this.options.editFields.filter(f => this.fields.find(({ name }) => name === f.name))
    },

    'options.editFields' () {
      this.options.viewFields = this.fields.filter(f => !this.options.editFields.find(({ name }) => name === f.name))
    },
  },

  created () {
    this.getAvailableModules()
    this.fields = [
      ...this.options.viewFields,
      ...this.options.editFields,
    ]
  },

  methods: {
    // Fetches modules that have atleast one record field and are not already used in a RecordLines block
    getAvailableModules () {
      const alreadyUsedModules = this.page.blocks.filter(({ kind, options }) => {
        if (kind === 'RecordLines') {
          if (options.moduleID && this.relatedModule) {
            return options.moduleID !== this.options.moduleID
          } else {
            return true
          }
        }
        return false
      }).map(b => b.options.moduleID)
      this.availableModules = this.modules.filter(m => m.fields.find(({ kind }) => kind === 'Record') && !alreadyUsedModules.includes(m.moduleID))
    },
  },
}
</script>

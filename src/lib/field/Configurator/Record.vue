<template>
  <div>
    <div class="form-group">
      <label class="d-block">{{ $t('field.kind.record.moduleLabel') }}</label>
      <b-form-select v-model="f.options.moduleID"
                     :options="modules"
                     text-field="name"
                     value-field="moduleID"
                     class="form-control">
        <template slot="first"><option disabled :value="undefined">{{ $t('field.kind.record.modulePlaceholder') }}</option></template>
      </b-form-select>
    </div>

    <div class="form-group">
      <label class="d-block">{{ $t('field.kind.record.recordFieldLabel') }}</label>
      <b-form-select v-model="f.options.labelField"
                     class="form-control"
                     :options="fields"
                     :disabled="!module">
        <template slot="first"><option disabled :value="undefined">{{ $t('field.kind.record.recordFieldPlaceholder') }}</option></template>
      </b-form-select>
    </div>
    <div class="form-group">
      <label class="d-block">{{ $t('field.kind.record.queryFieldsLabel') }}</label>
      <b-form-select v-model="f.options.queryFields"
                     class="form-control"
                     :options="fields"
                     multiple
                     :disabled="!module">
      </b-form-select>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import base from './base'
import { Record } from '@/lib/field/Record'

// @todo rename to Record and make appropriate changes...
export default {
  extends: base,

  data () {
    return {
      selected: null,
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    module () {
      if (this.f.options.moduleID !== '0') {
        return this.$store.getters['module/getByID'](this.f.options.moduleID)
      } else {
        return undefined
      }
    },

    fields () {
      return this.module ? this.module.fields.map(f => { return { value: f.name, text: this.$t(f.label) || f.name } }) : []
    },
  },

  watch: {
    'f.options.moduleID' () {
      this.f.options.labelField = undefined
      this.f.options.queryFields = []
    },
  },

  created () {
    this.f.options = new Record(this.f.options)
  },
}
</script>

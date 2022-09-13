<template>
  <div
    v-if="module"
  >
    <b-form-group>
      <b-form-checkbox
        v-model="module.config.recordRevisions.enabled"
      >
        {{ $t('enabled') }}
      </b-form-checkbox>
    </b-form-group>
    <b-form-group
      :label="$t('ident.label')"
      :description="$t('ident.description')"
      label-class="text-primary"
    >
      <b-input
        v-model="module.config.recordRevisions.ident"
        :disabled="!module.config.recordRevisions.enabled"
        :placeholder="$t('ident.placeholder')"
      />
    </b-form-group>
  </div>
</template>

<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  i18nOptions: {
    namespaces: 'module',
    keyPrefix: 'edit.config.record-revisions',
  },

  props: {
    module: {
      type: compose.Module,
      required: true,
    },
  },

  data () {
    return {
      processing: false,
    }
  },
}
</script>

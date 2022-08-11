<template>
  <b-tab :title="$t('label')">
    <b-form-group>
      <b-form-checkbox
        v-model="options.preload"
        :value="true"
        :unchecked-value="false"
      >
        {{ $t('preload') }}
      </b-form-checkbox>
    </b-form-group>
  </b-tab>
</template>
<script>
import { compose, validator } from '@cortezaproject/corteza-js'
import base from './base'

export default {
  i18nOptions: {
    namespaces: 'block',
    key: 'record-revisions',
  },

  name: 'RecordRevisions',

  components: {},

  extends: base,

  data () {
    return {
      /*
        These are mocks that allow us to use the field editor component.
        Since we want all the field kinds to work properly out of the box, the field editor component is best for this case.
      */
      mock: {
        namespace: new compose.Namespace(),
        module: new compose.Module(),
        record: new compose.Record(),
        errors: new validator.Validated(),
      },
    }
  },

}
</script>
<style lang="scss" scoped>
.fields {
  height: 150px;
  overflow-y: auto;
  cursor: default;
}
</style>

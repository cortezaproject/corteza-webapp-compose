<template>
  <div>
    <b-form-group>
      <b-form-checkbox v-model="f.options.presetWithAuthenticated">
        {{ $t('field.kind.user.presetWithCurrentUser') }}
      </b-form-checkbox>
    </b-form-group>
    <b-form-group>
      <label class="d-block">{{ $t('field.kind.select.optionType.label') }}</label>
      <b-form-radio-group
        v-model="f.options.selectType"
        :options="selectOptions"
        stacked
      ></b-form-radio-group>
    </b-form-group>
    <b-form-group
      v-if="f.options.roles"
    >
      <label>
        {{ $t('field.kind.user.rolesLabel') }}
      </label>
      <vue-select
        v-model="f.options.roles"
        :options="roleOptions"
        option-value="roleID"
        option-text="name"
        :close-on-select="false"
        multiple
        label="name"
      />
    </b-form-group>
  </div>
</template>

<script>
import base from './base'
import { VueSelect } from 'vue-select'

export default {
  components: {
    VueSelect,
  },

  extends: base,

  data () {
    return {
      selectOptions: [
        { text: this.$t('field.kind.select.optionType.default'), value: 'default' },
        { text: this.$t('field.kind.select.optionType.multiple'), value: 'multiple' },
        { text: this.$t('field.kind.select.optionType.each'), value: 'each' },
      ],
      roleOptions: [],
    }
  },

  mounted () {
    this.$SystemAPI.roleList().then(({ set: roles = [] }) => {
      this.roleOptions = roles
    })
  },
}
</script>

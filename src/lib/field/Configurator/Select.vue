<template>
  <b-row no-gutters>
    <b-col>
      <b-form-group>
        <div>{{ $t('field.kind.select.optionsLabel') }}</div>
        <b-input-group v-for="(option, index) in f.options.options"
                       class="mb-1"
                       :key="index">
          <b-form-input plain
                        v-model="f.options.options[index]"
                        size="sm"></b-form-input>
          <b-input-group-append>
            <b-button v-if="!isDefault(option)"
                      @click="asDefault(option)"
                      variant="outline-primary"
                      size="sm">
              {{ $t('general.label.makeDefault') }}
            </b-button>
            <b-button v-else
                      @click="asDefault(undefined)"
                      variant="primary"
                      size="sm">
              {{ $t('general.label.removeDefault') }}
            </b-button>

            <b-button @click.prevent="f.options.options.splice(index, 1)"
                      variant="outline-danger"
                      class="border-0">
              <font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>

        <b-input-group>
          <b-form-input plain v-model="newOption" @keypress.enter.prevent="handleAddOption" size="sm" :placeholder="$t('field.kind.select.optionRemove')"></b-form-input>
          <b-input-group-append>
            <b-button @click.prevent="handleAddOption"
                      variant="primary"
                      size="sm"
                      :disabled="newOption.length === 0">
              + {{ $t('field.kind.select.optionAdd') }}
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-form-group>
        <label class="d-block">{{ $t('field.kind.select.optionType.label') }}</label>
        <b-form-radio-group
          v-model="f.options.selectType"
          :options="selectOptions"
          stacked
        ></b-form-radio-group>
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      newOption: '',
      selectOptions: [
        { text: this.$t('field.kind.select.optionType.default'), value: 'default' },
        { text: this.$t('field.kind.select.optionType.multiple'), value: 'multiple' },
        { text: this.$t('field.kind.select.optionType.each'), value: 'each' },
      ],
    }
  },

  created () {
    if (!this.f) {
      this.f.options = { options: [] }
    } else if (!this.f.options.options) {
      this.f.options.options = []
    }
  },

  methods: {
    asDefault (value) {
      if (value === undefined) {
        this.$set(this.f, 'defaultValue', undefined)
      } else {
        this.$set(this.f, 'defaultValue', [
          { name: this.f.name, value },
        ])
      }
    },

    handleAddOption () {
      if (this.newOption.length > 0) {
        this.f.options.options.push(this.newOption)
        this.newOption = ''
      }
    },

    isDefault (option) {
      return (this.f.defaultValue || []).find(({ value }) => value === option)
    },
  },
}
</script>

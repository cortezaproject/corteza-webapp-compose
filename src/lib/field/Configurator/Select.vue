<template>
  <div class="row no-gutters">
    <div class="form-group col-10">
      <div>Options to select from</div>
      <div v-for="(option, index) in f.options.options" :key="index">
        <b-form-input plain v-model="f.options.options[index]" size="sm"></b-form-input>
        <button @click.prevent="f.options.options.splice(index, 1)" class="btn-url">Remove</button>
      </div>
      <b-form-input plain v-model="newOption" @keypress.enter.prevent="handleAddOption" size="sm"></b-form-input>
      <button @click.prevent="handleAddOption" :disabled="newOption.length === 0" class="btn-url">+ Add</button>
    </div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      newOption: '',
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
    handleAddOption () {
      if (this.newOption.length > 0) {
        this.f.options.options.push(this.newOption)
        this.newOption = ''
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/btns.scss";

input {
  display: inline;
  width: calc(100% - 60px);
  margin-right: 10px;
}
</style>

<template>
  <div class="row no-gutters">
    <div class="form-group col-6">
      <div>Options to select from</div>
      <table>
        <tr v-for="(option, index) in f.options.options" :key="index">
          <td><input v-model="f.options.options[index]" /></td>
          <td><button @click.prevent="f.options.options.splice(index, 1)">-</button></td>
        </tr>
        <tr>
          <td><input v-model="newOption" @keypress.enter.prevent="handleAddOption" /></td>
          <td><button @click.prevent="handleAddOption" :disabled="newOption.length === 0">+</button></td>
        </tr>
      </table>
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
    if (!this.o) {
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

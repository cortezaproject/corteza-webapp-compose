<template>
  <div class="row no-gutters">
    <div class="form-group col-6">
      <div>Options to select from</div>
      <table>
        <tr v-for="(option, index) in o.options" :key="index">
          <td><input v-model="o.options[index]" /></td>
          <td><button @click.prevent="o.options.splice(index, 1)">-</button></td>
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
import optionsSyncProp from './mixins/optionsSyncProp'

export default {
  mixins: [
    optionsSyncProp,
  ],

  data () {
    return {
      newOption: '',
    }
  },

  created () {
    if (!this.o) {
      this.o = { options: [] }
    } else if (!this.o.options) {
      this.o.options = []
    }
  },

  methods: {
    handleAddOption () {
      if (this.newOption.length > 0) {
        this.o.options.push(this.newOption)
        this.newOption = ''
      }
    },
  },
}
</script>

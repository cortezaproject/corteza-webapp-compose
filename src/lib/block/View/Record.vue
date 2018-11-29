<template>
    <div v-if="record">
      <div v-for="field in options.fields" :key="field.id">
        <div class="form-group" v-if="field.kind === 'text'">
          <label>{{field.name}}</label>
          <!-- <input class="form-control" type="text"> -->
        </div>
        <div class="form-group" v-else-if="field.kind === 'textarea'">
          <label>{{field.name}}</label>
          <!-- <textarea class="form-control"></textarea> -->
        </div>
        <!-- <div class="form-group form-check" v-else-if="field.kind === 'bool'">
          <input type="checkbox" id="visible" class="form-check-input">
          <label for="visible" class="form-check-label">{{field.name}}</label>
        </div> -->
        <div class="form-group" v-else-if="field.kind === 'bool'">
          <label class="form-check-label">{{field.name}}</label>
        </div>
        <div class="form-group" v-else-if="field.kind === 'email'">
          <label>{{field.name}}</label>
          <!-- <input class="form-control" type="email"> -->
        </div>
        <div class="form-group" v-else-if="field.kind === 'stamp'">
          <label>{{field.name}}</label>
          <!-- <input class="form-control" type="datetime"> -->
        </div>
        <div class="form-group" v-else-if="field.kind === 'enum'">
          <label>{{field.name}}</label>
          <!-- <select class="form-control">
            <option>TODO</option>
          </select> -->
        </div>
        <div v-else>
          Unknow kind od field.
        </div>
        {{ recordValue(field) }}
      </div>
    </div>
    <div v-else>
      Can not render this block without a record
    </div>
</template>
<script>
import optionProp from './mixins/optionsProp.js'

export default {
  props: {
    record: {
      type: Object,
      required: false, // actually true, but we'll going to fail soft here
    },
  },

  computed: {
    recordValue () {
      return (field) => (this.record.fields.find(f => f.name === field.name) || {}).value
    },
  },

  mixins: [
    optionProp,
  ],
}
</script>

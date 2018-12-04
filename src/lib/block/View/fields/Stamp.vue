<template>
  <div class="form-group">
    <label>{{field.name}}</label>
    <input class="form-control" type="datetime" v-model="recordValue" readonly>
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldStamp',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

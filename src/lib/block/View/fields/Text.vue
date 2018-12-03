<template>
  <div class="form-group">
    <label>{{field.title}}</label>
    <input class="form-control" type="text" v-model="recordValue" readonly>
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldText',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

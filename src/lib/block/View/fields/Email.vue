<template>
  <div class="form-group">
    <label>{{field.name}}</label>
    <input class="form-control" type="email" v-model="recordValue" readonly>
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldEmail',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

<template>
  <div class="form-group">
    <label>{{field.name}}</label>
    <textarea class="form-control" v-model="recordValue" readonly></textarea>
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldTextarea',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

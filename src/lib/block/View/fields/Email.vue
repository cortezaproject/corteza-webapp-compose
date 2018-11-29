<template>
  <div class="form-group">
    <label>{{field.name}}</label>
    <input class="form-control" type="email">
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldemail',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

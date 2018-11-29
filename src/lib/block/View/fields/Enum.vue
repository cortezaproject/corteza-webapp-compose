<template>
  <div class="form-group">
    <label>{{field.name}}</label>
    <select class="form-control">
      <option>TODO</option>
    </select>
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldenum',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

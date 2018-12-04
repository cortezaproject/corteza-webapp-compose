<template>
  <div class="form-group">
    <label>{{field.name}}</label>
    <select class="form-control" disabled>
      <option selected>{{ recordValue}} </option>
    </select>
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldEnum',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

<template>
  <div class="form-group">
    <label>{{field.name}}</label>
    <input class="form-control" type="text">
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldtext',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

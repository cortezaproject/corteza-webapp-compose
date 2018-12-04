<template>
  <div class="form-group">
    <label>{{field.name}}</label>
    <textarea class="form-control"></textarea>
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldtextarea',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

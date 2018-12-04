<template>
  <div class="form-group">
    <input type="checkbox" id="visible" class="form-check-input" readonly>
    <label for="visible" class="form-check-label">{{field.name}}</label>
  </div>
</template>
<script>
import fieldPropMixin from './mixins/fieldProp'

export default {
  name: 'fieldBool',
  computed: {},

  mixins: [fieldPropMixin],
}
</script>

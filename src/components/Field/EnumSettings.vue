<template>
  <div class="row no-gutters">
    <div class="form-group col-6">
      <label class="d-block">Possible selections (one per line)</label>
      <textarea name="field.name + '_settings[items]'" v-model="settings.items" class="form-control" rows="10"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    'field': Object,
  },
  name: 'Module-Field-Related',
  data () {
    return {
      modules: [],
      settings: {
        items: '',
      },
    }
  },
}
</script>

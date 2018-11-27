<template>
    <div>
        <fieldset class="form-group">
            <label for="select-content-list">Module</label>

            <select v-model="o.moduleID" required class="form-control" id="select-content-list">
                <option disabled selected>---</option>
                <option v-for="module in modules" :key="module.id" :value="module.moduleID">{{ module.name }}</option>
            </select>

            <div class="list__fields" v-if="o.moduleID">
                <label>Columns selected</label>
                <draggable class="drag-area" :options="{group:'fields'}" v-model="o.fields" @start="drag=true" @end="drag=false">
                    <div v-for="field in o.fields" :key="field.id">{{field.name}}</div>
                </draggable>
                <label>Columns available</label>
                <draggable class="drag-area" :options="{group:'fields'}" @start="drag=true" @end="drag=false">
                    <div v-for="field in availableFields" :key="field.id">{{field.name}}</div>
                </draggable>
                <i>Drag fields from available to selected to include them to record info page</i>
            </div>
        </fieldset>
    </div>
</template>
<script>
import draggable from 'vuedraggable'
import { Record } from '@/lib/block/Record'

export default {
  name: 'Record',
  props: {
    options: {
      type: Object,
      default () { return new Record() },
    },
  },

  computed: {
    o: {
      get () {
        return this.options
      },

      set (o) {
        this.$emit('update:options', o)
      },
    },

    availableFields () {
      const fields = [
        { id: '1', name: 'Fake field F1' },
        { id: '2', name: 'Fake field F2' },
        { id: '3', name: 'Fake field F3' },
        { id: '4', name: 'Fake field F4' },
      ]

      if (this.options.fields) {
        return fields.filter(a => { return this.options.fields.findIndex(f => a.id === f.id) === -1 })
      }

      return fields
    },
  },

  data () {
    return {
      error: null,

      modules: [],
    }
  },

  created () {
    this.$crm.moduleList({}).then(mm => {
      this.modules = mm
    }).catch(err => {
      this.error = err
    })
  },

  components: {
    draggable,
  },
}
</script>
<style lang="scss" scoped>
.drag-area {
  min-height: 100px;
  border: 1px solid silver;
  padding: 2px;
}
</style>

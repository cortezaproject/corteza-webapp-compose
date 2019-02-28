<template>
  <div class="storybook">
    <h1>Crust CRM Storybook</h1>
    <table border="1">
      <tr>
        <th></th>
        <td>Configuration options</td>
        <td>Input component for end-user</td>
        <td>Raw data</td>
        <td>Output component for end-user</td>
      </tr>
      <tr v-for="(field, index) in module.fields" :key="index">
        <th><b>{{ field.kind }}</b></th>
        <td>
          <label><input type="checkbox" v-model="field.isRequired"> Required</label>
          <hr />
          <field-configurator :field.sync="field" />
          <hr />
          <pre>Required: {{ field.isRequired }}</pre>
          <pre>{{ field.options }}</pre>
        </td>
        <td>
          <field-editor :field.sync="field" :validate="true" :record.sync="record" />
        </td>
        <td>
          <pre>{{ record.values[field.name] || '[undefined]' }}</pre>
        </td>
        <td>
          <field-viewer :field="field" :record="record" />
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import fieldKinds from '@/lib/field/list'
import Field from '@/lib/field'
import Module from '@/lib/module'
import Record from '@/lib/record'
import FieldConfigurator from '@/lib/field/Configurator'
import FieldEditor from '@/lib/field/Editor'
import FieldViewer from '@/lib/field/Viewer'

export default {
  data () {
    let module = new Module({
      name: 'StoryBook mock',
      fields: fieldKinds.map(k => new Field({ kind: k.kind, name: k.kind, label: k.kind + ' label' })),
    })

    return {
      module,
      record: new Record(module),
    }
  },

  components: {
    FieldConfigurator,
    FieldEditor,
    FieldViewer,
  },
}
</script>
<style scoped="scoped" lang="scss">

.storybook {
  overflow: scroll;

  table {
    width: 100%;

    th {
      width: 100px;
      vertical-align: top;
    }

    td {
      width: 250px;
      vertical-align: top;
    }
  }
}
</style>

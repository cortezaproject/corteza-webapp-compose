<template>
  <div class="storybook">
    <h1>Crust Compose Storybook</h1>
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
import fieldKinds from 'corteza-webapp-compose/src/lib/field/list'
import Field from 'corteza-webapp-compose/src/lib/field'
import Module from 'corteza-webapp-compose/src/lib/module'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import FieldConfigurator from 'corteza-webapp-compose/src/lib/field/Configurator'
import FieldEditor from 'corteza-webapp-compose/src/lib/field/Editor'
import FieldViewer from 'corteza-webapp-compose/src/lib/field/Viewer'

export default {
  components: {
    FieldConfigurator,
    FieldEditor,
    FieldViewer,
  },

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

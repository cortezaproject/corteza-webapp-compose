<template>
  <div class="storybook">
    <h1>Crust CRM Storybook</h1>
    <grid :blocks="blocks">
      <template slot-scope="{ block, index }">
        <block-editor :block="block" :record="record" v-if="block.title==='Editor'" />
        <block-viewer :block="block" :record="record" v-else />
      </template>
    </grid>
    <div class="debug">
      <code>Record: {{ record }}</code>
    </div>
  </div>
</template>
<script>
import Grid from '@/components/Common/Grid'
import BlockViewer from '@/lib/block/View'
import BlockEditor from '@/lib/block/Edit'

export default {
  data () {
    const f = (kind) => {
      return {
        kind: kind,
        name: 'field_' + kind,
        title: 'Field (' + kind + ')',
      }
    }

    return {
      blocks: [
        {
          x: 0,
          y: 0,
          width: 6,
          height: 8,

          title: 'Editor',
          kind: 'Record',
          options: {
            fields: [
              f('text'),
              f('textarea'),
              f('bool'),
              f('email'),
              f('stamp'),
            ],
          },
        },
        {
          x: 6,
          y: 0,
          width: 6,
          height: 8,

          title: 'Viewer',
          kind: 'Record',
          options: {
            fields: [
              f('text'),
              f('textarea'),
              f('bool'),
              f('email'),
              f('stamp'),
            ],
          },
        },
      ],

      record: {
        fields: [
          { name: 'field_bool', value: false },
        ],
      },
    }
  },

  components: {
    Grid,
    BlockViewer,
    BlockEditor,
  },
}
</script>
<style scoped="scoped" lang="scss">
.debug {
  display: flex;
  margin: 0 30px;

  pre {
    flex: 1;
  }
}
</style>

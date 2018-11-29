<template>
  <div class="vue-grid-item cssTransforms" style="transform: translate3d(10px, 10px, 0); width: 1000px; height: 630px; position: absolute;">
    <div>
      <!-- start CRM page block -->
      <div class="gridblock_contents">
        <div class="blockname">Blockname</div>
        <div class="block_header">Block header text</div>
        <div class="form_row">
          <button style="float:right; margin:14px 5px 0 0;" type="button" class="btn btn-primary">New {modulename} record</button>
          <!--<BlockContentFields />-->
        </div>
      </div>
      <!-- end CRM page block -->
    </div>
  </div>
</template>

<script>

// import BlockContentFields from '@/components/block/content/list/BlockContentList'

// Sending the fields is not working yet, so they are hard coded directly in the component fo now...
export default {
  name: 'App',
  components: {
    // BlockContentFields,
  },
  data () {
    return {
      content: { fields: [
        {
          name: 'name',
          title: '<span class="orange glyphicon glyphicon-user"></span> Full Name',
          sortField: 'name',
        },
        {
          name: 'email',
          title: 'Email',
          sortField: 'email',
        },
        'birthdate', 'nickname',
        {
          name: 'gender',
          title: 'Gender',
          sortField: 'gender',
        },
        '__slot:actions',
      ] },
    }
  },
  computed: {
    list () {
      return this.content
    },
  },
}
</script>

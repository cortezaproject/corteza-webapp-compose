<template>
  <div class="container">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th v-for="field in fields" :key="field.id">{{ field.name }}</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr>
          <td v-for="field in fields" :key="field.id"></td>
          <td></td>
        </tr>
        <tr>
          <td v-for="field in fields" :key="field.id"></td>
          <td></td>
        </tr>
        <tr>
          <td v-for="field in fields" :key="field.id"></td>
          <td></td>
        </tr>
        <tr>
        </tr> -->
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'BlockContentListBuilder',
  components: {},
  props: ['list'],
  computed: {
    fields () {
      const result =
        this.list && this.list.fields && this.list.fields.length > 0
          ? this.list.fields
          : []
      return result
    },
  },
}
</script>

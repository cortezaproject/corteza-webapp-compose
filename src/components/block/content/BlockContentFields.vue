<template>
  <div class="block-content-fields">
    <form>
      <fieldset>
        <div v-for="field in sortedFields" :key="field.id">
          <div v-if="field.kind === 'text'">
            <label class="">{{field.name}}</label>
            <input type="text" class="">
          </div>
          <div v-else-if="field.kind === 'textarea'">
            <label class="">{{field.name}}</label>
            <textarea></textarea>
          </div>
          <div v-else-if="field.kind === 'bool'">
            <label class="">{{field.name}}</label>
            <input type="checkbox">
          </div>
          <div v-else-if="field.kind === 'email'">
            <label class="">{{field.name}}</label>
            <input type="email">
          </div>
          <div v-else-if="field.kind === 'stamp'">
            <label class="">{{field.name}}</label>
            <input type="datetime">
          </div>
          <div v-else-if="field.kind === 'enum'">
            <label class="">{{field.name}}</label>
            <select>
              <option>TODO</option>
            </select>
          </div>
          <div v-else>
            Unknow kind od field.
          </div>
        </div>
      </fieldset>
      <fieldset class="form-group">
        <!-- <button disabled type="submit" class="btn btn-primary">Submit</button> -->
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  name: 'BlockContentFields',
  props: ['fields'],
  computed: {
    sortedFields () {
      // TODO Sort ?
      return this.fields.concat()
    },
  },
}
</script>
<style lang="scss" scoped>
fieldset {
  border: none;
}
</style>

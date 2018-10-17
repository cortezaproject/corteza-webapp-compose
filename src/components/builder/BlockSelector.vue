<template>
  <div class="block-selector">

    <select :value="blockType" v-on:change="handleBlockTypeChange" name="block-type" id="block-type">
      <option v-bind:value="''" default selected disabled>-- Select a block type --</option>
      <!-- Maybe this needs to be dynamic -->
      <option v-bind:value="'fields'">Fields</option>
    </select>

    <div v-if="blockType" class="form-schema">
      <h4>Mode: {{ mode }}</h4>
      <form @submit.prevent="handleBlockSelectorFormSubmit">
        <fieldset class="form-group">

          <div class="form-group form-check">
            <input type="checkbox" id="fixed" class="form-check-input" v-model="addBlockFormMeta.fixed">
            <label for="fixed" class="form-check-label">Fixed ?</label>
          </div>

        </fieldset>

        <fieldset class="form-group">

          <div class="form-group">
            <label for="title">Title</label>
            <input v-model="addBlockFormData.title" type="text" class="form-control form-control-sm" id="title" placeholder="Block Title">
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <input v-model="addBlockFormData.description" type="text" class="form-control form-control-sm" id="description" placeholder="Block Description">
          </div>

          <div class="form-group">
            <label for="footer">Footer</label>
            <input v-model="addBlockFormData.footer" type="text" class="form-control form-control-sm" id="footer" placeholder="Block Footer">
          </div>

        </fieldset>

        <fieldset class="form-group">
          <p>TODO: Spécific fields</p>
        </fieldset>

        <fieldset class="form-group">
          <button type="submit" class="btn btn-primary">Submit</button>
        </fieldset>
      </form>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'BlockSelector',

  computed: {
    ...mapState({
      blockType: state => state.builder.blockType,
      mode: state => state.builder.mode,
    }),

    addBlockFormData: {
      get () {
        return this.$store.state.builder.addBlockFormData
      },
      set (newValue) {
        this.$store.commit('builder/setAddBlockFormData', newValue)
      },
    },

    addBlockFormMeta: {
      get () {
        return this.$store.state.builder.addBlockFormMeta
      },
      set (newValue) {
        this.$store.commit('builder/setAddBlockFormMeta', newValue)
      },
    },
  },

  methods: {
    ...mapActions('builder', ['handleBlockTypeChange', 'handleBlockSelectorFormSubmit']),
  },
}
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/bootstrap";

.block-selector {
  z-index: 999;
  padding: 1em;
  background: lightgrey;
  position: absolute;
  bottom: 2em;
  left: 2em;
  border-radius: 1em;
}

fieldset {
  margin-bottom: 1em;
  margin-top: 1em;
  border: 1px dashed grey;
  padding: 0.5em;

  .form-group {
    margin-bottom: 1em;
  }
}
</style>

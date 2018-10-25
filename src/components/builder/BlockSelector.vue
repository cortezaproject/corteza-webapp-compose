<template>
  <div class="block-selector">

    <select :value="blockType" v-on:change="handleBlockTypeChange" name="block-type" id="block-type">
      <option v-bind:value="''" default selected disabled>-- Select a block type --</option>
      <option v-if="contentFieldsEnabled" v-bind:value="'fields'">Fields</option>
      <option v-if="contentListEnabled" v-bind:value="'list'">List</option>
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

        <fieldset class="form-group" v-if="contentFieldsEnabled">
          <label for="select-content-fields">Fields Selected</label>
          <draggable class="drag-area" :options="{group:'people'}" v-model="addBlockFormContentFields" @start="drag=true" @end="drag=true">
            <div v-for="element in addBlockFormContentFields" :key="element.id">{{element.name}}</div>
          </draggable>
          <br>
          <label for="select-content-fields">Fields Available</label>
          <draggable class="drag-area" :options="{group:'people'}" v-model="contentFieldsAvailable" @start="drag=true" @end="drag=true">
            <div v-for="element in contentFieldsAvailable" :key="element.id">{{element.name}}</div>
          </draggable>
          <div style="color:red" v-if="!contentFieldsEnabled">
            Fields are not available here.
            <br>
            <router-link :to="'/crm/pages/' + this.$route.query.pageId + '/edit'" class="actions__action">Set a module with fields</router-link>.
          </div>
        </fieldset>
        <fieldset class="form-group" v-if="contentListEnabled">
          <label for="select-content-list">Module</label>
          <div v-if="modulesListError" style="color:red">
            {{ modulesListError }}
          </div>
          <!-- B select a module -->
          <select required v-model="addBlockFormContentBuilderListModule" class="form-control" id="select-content-list">
            <option v-for="module in modulesList" :key="module.id" :value="module">{{ module.name }}</option>
          </select>
          <!-- E select a module -->

          <!-- B select fields of module -->
          <div class="list__fields">
            <label for="select-content-fields">Fields Selected</label>
            <draggable class="drag-area" :options="{group:'people'}" v-model="addBlockFormContentBuilderListFields" @start="drag=true" @end="drag=true">
              <div v-for="element in addBlockFormContentBuilderListFields" :key="element.id">{{element.name}}</div>
            </draggable>
            <br>
            <label for="select-content-fields">Fields Available</label>
            <draggable class="drag-area" :options="{group:'people'}" v-model="contentListFieldsAvailable" @start="drag=true" @end="drag=true">
              <div v-for="element in contentListFieldsAvailable" :key="element.id">{{element.name}}</div>
            </draggable>
          </div>
           <!-- E select fields of module -->
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
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import draggable from 'vuedraggable'
Vue.component('multiselect', Multiselect)

export default {
  name: 'BlockSelector',
  components: {
    draggable,
  },
  async created () {
    try {
      this.modulesListError = ''
      await Promise.all([
        this.$store.dispatch('modules/initList'),
      ])
    } catch (e) {
      this.modulesListError = 'Error when trying to init modules.'
    }
  },
  computed: {
    ...mapState('builder', [
      'blockType',
      'mode',
      'contentFieldsEnabled',
      'contentListEnabled',
    ]),
    ...mapState('modules', {
      'modulesList': 'list',
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

    addBlockFormContentFields: {
      get () {
        return this.$store.state.builder.addBlockFormContent.fields
      },
      set (newValue) {
        this.$store.commit('builder/setAddBlockFormContentFields', newValue)
      },
    },

    contentFieldsAvailable: {
      get () {
        return this.$store.state.builder.contentFieldsAvailable
      },
      set (newValue) {
        this.$store.commit('builder/setContentFieldsAvailable', newValue)
      },
    },

    contentListFieldsAvailable: {
      get () {
        return this.$store.state.builder.contentListFieldsAvailable
      },
      set (newValue) {
        this.$store.commit('builder/setContentListFieldsAvailable', newValue)
      },
    },

    addBlockFormContentBuilderListFields: {
      get () {
        return this.$store.state.builder.addBlockFormContent.listBuilder.fields
      },
      set (newValue) {
        this.$store.commit('builder/setAddBlockFormContentBuilderListFields', newValue)
      },
    },

    addBlockFormContentBuilderListModule: {
      get () {
        return this.$store.state.builder.addBlockFormContent.listBuilder.module
      },
      set (newValue) {
        this.$store.dispatch('builder/setAddBlockFormContentBuilderListModule', newValue)
      },
    },
  },

  methods: {
    ...mapActions('builder', [
      'handleBlockTypeChange',
      'handleBlockSelectorFormSubmit',
    ]),
  },
}
</script>
<style lang="scss" scoped>
@import "~bootstrap/scss/bootstrap";
@import "~vue-multiselect/dist/vue-multiselect.min.css";

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

.drag-area {
  min-height: 100px;
  background-color: white;
}
</style>

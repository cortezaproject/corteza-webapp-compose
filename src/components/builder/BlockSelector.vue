<template>
  <div class="block-selector">

    <div class="row">
      <div class="col-8">
        <select :value="blockType" v-on:change="handleBlockTypeChange($event.target.value)" name="block-type" id="block-type">
          <option v-bind:value="''" default selected disabled>-- Select a block type --</option>
          <option v-if="contentFieldsEnabled" v-bind:value="'fields'">Fields</option>
          <option v-bind:value="'list'">List</option>
          <option v-bind:value="'chart'">Chart</option>
          <option v-bind:value="'text'">Text</option>
          <option v-bind:value="'social'">Social media feed</option>
        </select>
      </div>
      <div v-if="blockType" class="col-4 content-form-cancel">
        <button type="button" v-on:click="resetForm()" class="btn btn-default">Cancel</button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div v-if="blockType" class="form-schema">
          <div class="row">
            <h4>Mode: {{ mode }}</h4>
          </div>
          <div class="row">
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
              </fieldset>
              <fieldset class="form-group" v-if="contentListEnabled">
                <label for="select-content-list">Module</label>
                <div v-if="modulesListError" style="color:red;">
                  {{ modulesListError }}
                </div>
                <!-- B select a module -->
                <select :value="selectedModule ? selectedModule.id : null" required @input="handleSelectContentListModule($event.target.value)" class="form-control" id="select-content-list">
                  <option v-for="module in modulesList" :key="module.id" :value="module.id">{{ module.name }}</option>
                </select>
                <!-- E select a module -->

                <!-- B select fields of module -->
                <div class="list__fields">
                  <br>
                  <label for="select-content-fields">Columns Selected</label>
                  <draggable class="drag-area" :options="{group:'people'}" v-model="addBlockFormContentBuilderListFields" @start="drag=true" @end="drag=true">
                    <div v-for="element in addBlockFormContentBuilderListFields" :key="element.id">{{element.name}}</div>
                  </draggable>
                  <br>
                  <label for="select-content-fields">Columns Available</label>
                  <draggable class="drag-area" :options="{group:'people'}" v-model="contentListFieldsAvailable" @start="drag=true" @end="drag=true">
                    <div v-for="element in contentListFieldsAvailable" :key="element.id">{{element.name}}</div>
                  </draggable>
                </div>
                <!-- E select fields of module -->
              </fieldset>
              <fieldset class="form-group" v-if="contentChartEnabled">
                List of all chart that are generated in the chart module.
              </fieldset>
              <fieldset class="form-group" v-if="contentTextEnabled">
                A text block that allows HTML. Best would be a TinyMCE or similar.
                <textarea rows="5"></textarea>
              </fieldset>
              <fieldset class="form-group" v-if="contentSocialEnabled">
                Social media feed from Twitter.
                <br />
                Must allow to read the value of a field if the page has a module, such as account.twitter-handle (which could be @tesla for example for a lead from Tesla)
                <br />
                Alternatively, if there is no module, it should allow any value from a normal text input field, where we can load for example: "@bloomberg" (for a feed from bloomberg on a dashboard page)
              </fieldset>
              <fieldset class="form-group">
                <button type="submit" class="btn btn-primary">Submit</button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import draggable from 'vuedraggable'
import SharedService from '@/services/SharedService'

Vue.component('multiselect', Multiselect)

export default {
  name: 'BlockSelector',
  components: {
    draggable,
  },
  props: {
    pageData: null,
    blockToEdit: null,
  },
  data () {
    return {
      modulesList: [],
      mode: 'add',
      selectedModule: null,
      contentListEnabled: true,
      contentFieldsEnabled: false,
      contentChartEnabled: false,
      contentTextEnabled: false,
      contentSocialEnabled: false,
      blockType: null,
      contentListFieldsAvailable: [],
      addBlockFormContentBuilderListFields: [],
      addBlockFormContentFields: [],
      addBlockFormData: {
        title: '',
        description: '',
        footer: '',
      },
      addBlockFormMeta: {
        fixed: false,
      },
      editedBlock: null,
    }
  },
  async created () {
    try {
      this.modulesListError = ''
      this.modulesList = await this.$crm.moduleList({})
    } catch (e) {
      this.modulesListError = 'Error when trying to init modules.'
    }
  },
  methods: {
    handleBlockTypeChange (blockType) {
      this.blockType = blockType

      this.contentListEnabled = false
      this.contentFieldsEnabled = false
      this.contentChartEnabled = false
      this.contentTextEnabled = false
      this.contentSocialEnabled = false

      // Hiding and showing the fieldsets
      switch (this.blockType) {
        case 'list':
          this.contentListEnabled = true
          break
        case 'fields':
          this.contentFieldsEnabled = true
          break
        case 'chart':
          this.contentChartEnabled = true
          break
        case 'text':
          this.contentTextEnabled = true
          break
        case 'social':
          this.contentSocialEnabled = true
          break
      }
    },
    handleSelectContentListModule (moduleId) {
      // find the module that was selected
      this.selectedModule = this.modulesList.find(x => x.id === moduleId.toString())
      // populate the available fields
      this.contentListFieldsAvailable = this.selectedModule.fields
    },
    handleBlockSelectorFormSubmit () {
      // emit the event to the parent page
      if (this.mode === 'add') {
        // adding a new block
        this.$emit('addNewBlock', {
          selectedModule: this.selectedModule,
          content: {
            fields: this.addBlockFormContentBuilderListFields,
            module: this.selectedModule,
          },
          blockType: this.blockType,
          addBlockFormData: this.addBlockFormData,
          addBlockFormMeta: this.addBlockFormMeta,
          addBlockFormContentFields: this.addBlockFormContentFields,
        })
        // reset the form
        this.resetForm()
      } else {
        // editing an existing block
        this.editedBlock.content.module = this.selectedModule
        this.editedBlock.content.fields = this.addBlockFormContentBuilderListFields
        this.editedBlock.meta = this.addBlockFormMeta
        this.editedBlock.data = this.addBlockFormData
        this.editedBlock.blockType = this.blockType

        this.$emit('blockHasBeenEdited', {
          editedBlock: this.editedBlock,
        })
        // reset the form
        this.resetForm()
      }
    },
    resetForm () {
      // reset the form
      this.selectedModule = null
      this.blockType = null
      this.contentListEnabled = false
      this.contentFieldsEnabled = false
      this.contentChartEnabled = false
      this.contentTextEnabled = false
      this.contentSocialEnabled = false
      this.contentListFieldsAvailable = []
      this.addBlockFormContentBuilderListFields = []
      this.addBlockFormContentFields = []
      this.addBlockFormData = {
        title: '',
        description: '',
        footer: '',
      }
    },
  },
  watch: {
    blockToEdit: {
      handler: function () {
        if (this.blockToEdit != null) {
          this.mode = 'edit'
          // create a copy of the block to isolate changes
          this.editedBlock = SharedService.cloneObject(this.blockToEdit)
          this.handleBlockTypeChange(this.editedBlock.blockType)
          this.addBlockFormMeta = this.editedBlock.meta
          this.addBlockFormData = this.editedBlock.data
          this.selectedModule = this.editedBlock.content.module
          this.contentListFieldsAvailable = this.editedBlock.content.module.fields
        } else {
          this.mode = 'add'
        }
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~vue-multiselect/dist/vue-multiselect.min.css';

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

.content-form-cancel {
  text-align: right;
}
</style>

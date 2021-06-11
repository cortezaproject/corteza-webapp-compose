<template>
  <div>
    <b-btn
      variant="light"
      size="lg"
      class="float-left"
      @click="showModal=true"
    >
      {{ $t('general.label.import') }}
    </b-btn>

    <b-modal
      v-model="showModal"
      size="lg"
      :title="$t('general.label.import')"
    >
      <b-input-group>
        <!-- To handle file upload -->
        <template v-if="!importObj">
          <b-form-file
            @change="loadFile"
            :placeholder="$t('general.label.importPlaceholder')"
            :browse-text="$t('general.label.browse')"
            class="font-wight-normal pointer"
          />

          <h6 v-if="processing" class="my-auto ml-3 ">
            {{ $t('general.label.processing') }}
          </h6>
        </template>

        <!-- To confirm selection & import -->
        <template v-else>
          <b-container class="p-0">
          <b-row no-gutters class="mb-3">
            <b-button variant="light" @click="selectAll(true)">
              {{ $t('field.selector.selectAll') }}
            </b-button>
            <b-button class="ml-2" variant="light" @click="selectAll(false)">
              {{ $t('field.selector.unselectAll') }}
            </b-button>
          </b-row>
          <b-row no-gutters>
            <b-col cols="12"
                   sm="6"
                   lg="4"
                   v-for="(o, index) in importObj.list" :key="index">
                <b-form-checkbox v-model="o.import">
                  {{ o.name || o.title }}
                </b-form-checkbox>
            </b-col>
          </b-row>
        </b-container>
        </template>
      </b-input-group>

      <div slot="modal-footer">
        <b-button
            :disabled="!importObj || !importObj.list.filter(i => i.import).length > 0"
            variant="primary"
            size="lg"
            @click="jsonImport(importObj)">
            {{ $t('general.label.import') }}
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from '../Chart'
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    namespace: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      showModal: false,
      importObj: null,
      processing: false,
      classes: {
        module: compose.Module,
        chart: Chart,
      },
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),
  },

  methods: {
    async jsonImport ({ list, type }) {
      this.processing = true
      const { namespaceID } = this.namespace
      const ItemClass = this.classes[type]
      try {
        for (let item of list.filter(i => i.import)) {
          if (this.importObj) {
            item = new ItemClass(item).import(this.getModuleID)
            item.namespaceID = namespaceID
            await this.$store.dispatch(`${this.type}/create`, item)
          } else {
            break
          }
        }
        this.toastSuccess(this.$t('notification.import.successful'))
      } catch (e) {
        this.toastWarning(this.$t('notification.import.failed'))(e)
      }
      this.cancelImport()
    },

    getModuleID (moduleName) {
      // find module, replaceID
      const matchedModules = this.modules.filter(m => m.name === moduleName)
      if (matchedModules.length > 0) {
        return matchedModules[0].moduleID
      } else {
        return null
      }
    },

    selectAll (selectAll) {
      this.importObj.list = this.importObj.list.map(i => {
        i.import = selectAll && true
        return i
      })
    },

    cancelImport () {
      this.importObj = null
      this.processing = false
      this.showModal = false
    },

    loadFile (e) {
      var file = e.target.files[0]
      if (file) {
        this.processing = true
        var reader = new FileReader()
        reader.readAsText(file)
        reader.onload = (evt) => {
          try {
            this.importObj = JSON.parse(evt.target.result)
            this.importObj.list = this.importObj.list.map(i => {
              return { import: true, ...i }
            })
          } catch ({ message }) {
            this.toastWarning(message)
          } finally {
            this.processing = false
          }
        }
        reader.onerror = (evt) => {
          this.toastWarning(this.$t('notification.import.errorReading'))
          this.processing = false
        }
      }
    },
  },
}
</script>
<style lang="scss">
$input-height: 42px;
$line-height: 30px;

.custom-file-input {
  height: $input-height;
}

.custom-file-label {
  height: $input-height;
  font-family: $regular;

  &::after {
    height: 100%;
    font-family: $btn-font-family;
    line-height: $line-height;
    background-color: $light;
    color: $dark;
    font-weight: 400;
    padding: $btn-padding-y $btn-padding-x;
  }
}
</style>

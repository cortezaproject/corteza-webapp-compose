<template>
  <form ref="importForm" @submit.prevent class="import-form">
    <p v-if="importErr">
      {{ this.importErr }}
    </p>

    <b-form-group :label="$t(`${type}.import`)">
      <b-input-group>
        <input @change="loadFile" type="file" class="input-file" />
        <button
              v-if="importObj && !processing"
              class="btn btn-dark"
              @click="jsonImport(importObj)">{{ $t('general.label.import') }}</button>
        <button
              v-if="importObj"
              class="btn btn-dark"
              @click="cancelImport">{{ $t('general.label.cancel') }}</button>
      </b-input-group>
    </b-form-group>
    <p v-if="processing">
      {{ $t('general.label.processing') }}
    </p>
  </form>
</template>

<script>
export default {
  props: {
    namespaceID: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      importObj: null,
      importErr: null,
      processing: false,
    }
  },

  methods: {
    async jsonImport ({ list, type }) {
      this.processing = true
      const namespaceID = this.namespaceID
      try {
        for (let item of list) {
          if (this.importObj) {
            await this.$store.dispatch(`${this.type}/create`, { namespaceID, ...item })
          } else {
            break
          }
        }
      } catch (e) {
        this.defaultErrorHandler(this.$t(`notification.${this.type}.importFailed`))
      }
      this.cancelImport()
    },

    cancelImport () {
      this.importObj = null
      this.processing = false
      this.$refs.importForm.reset()
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
          } catch (err) {
            this.importErr = err.message
          } finally {
            this.processing = false
          }
        }
        reader.onerror = (evt) => {
          this.importErr = 'err.fileRead'
          this.processing = false
        }
      } else {
        this.importErr = 'err.noFile'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.btn {
  border-radius: 0;
}

.import-form {
  margin: 0;
}
</style>

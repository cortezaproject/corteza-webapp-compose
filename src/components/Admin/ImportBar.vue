<template>
  <form ref="importForm" @submit.prevent class="import-form">
    <p v-if="importErr">
      {{ this.importErr }}
    </p>

    <p v-if="processing">
      {{ $t('general.label.processing') }}
    </p>

    <input @change="loadFile" type="file">
    <button
      v-if="importObj"
      @click="$emit('jsonImport', importObj)">{{ $t('general.label."import"') }}</button>

    <button
      v-if="importObj"
      @click="cancelImport">{{ $t('general.label."cancel"') }}</button>

  </form>
</template>

<script>
export default {
  data () {
    return {
      importObj: null,
      importErr: null,
      processing: false,
    }
  },

  methods: {
    cancelImport () {
      this.importObj = null
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

<style>

</style>

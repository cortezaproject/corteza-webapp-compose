<template>
  <div class="view">
    <toolbar :back-link="{name: 'admin.pages'}"
             :hide-delete="true">
      <button class="btn btn-blue"
              :disabled="!record.isValid()"
              @click.prevent="handleCreate">{{ $t('general.label.save') }}</button>
    </toolbar>
    <grid :namespace="namespace"
          :page="page"
          :record="record"
          v-if="record" edit-mode />
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'
import triggerRunner from '@/mixins/trigger_runner'
import Namespace from '@/lib/namespace'
import Page from '@/lib/page'
import Record from '@/lib/record'
import Toolbar from '@/components/Public/Page/Toolbar'

export default {
  name: 'CreateRecord',

  components: {
    Grid,
    Toolbar,
  },

  mixins: [
    triggerRunner,
  ],

  props: {
    page: { // via router-view
      type: Page,
      required: false,
    },

    namespace: { // via router-view
      type: Namespace,
      required: true,
    },

    refRecord: {
      type: Object,
      required: false,
    },
  },

  data () {
    return {
      record: null,
    }
  },

  computed: {
    module () {
      if (this.page.moduleID) {
        return this.$store.getters['module/getByID'](this.page.moduleID)
      }
    },
  },

  created () {
    this.record = new Record(this.module, {})

    if (this.refRecord) {
      // Record create form called from a related records block,
      // we'll try to find an appropriate field and cross-link this new record to ref
      const recRefField = this.module.fields.find(f => f.kind === 'Record' && f.options.moduleID === this.refRecord.moduleID)
      if (recRefField) {
        this.record.values[recRefField.name] = this.refRecord.recordID
      }
    }
  },

  methods: {
    handleCreate () {
      this.createRecord(this.module, this.record)
        .then((record) => {
          this.$router.push({ name: 'page.record.edit', params: { recordID: record.recordID } })
        })
        .catch(this.defaultErrorHandler(this.$t('notification.record.createFailed')))
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/_0.declare.scss";

.alert {
  position: absolute;
  z-index: 1;
  width: 100%;
  box-shadow: 0 0 2px 0 rgba($appgrey, 0.75);
}

.btn {
  margin-right: 0.5em;
}
</style>

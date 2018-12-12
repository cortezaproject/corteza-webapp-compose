<template>
  <div>
    <div class="editor">
      <router-link :to="{name: 'admin.modules.records'}" class="btn btn-url">&#171; Back to record list</router-link>
      <router-link :to="{ name: 'admin.modules.records', params: { moduleID }}" class="btn">Cancel</router-link>
      <button type="submit" class="btn btn-blue" @click.prevent="handleSave()">Save</button>
      <button type="button" class="btn btn-blue" @click.prevent="handleSave({ closeOnSuccess: true })">Save and close</button>
    </div>
    <section class="container well" v-if="module">
      <h2 v-if="!recordID">{{module.name}}: add new record</h2>
      <h2 v-else>{{module.name}}: edit existing record</h2>

      <b-alert show variant="warning" dismissible @dismissed="warningAlert=null" v-if="warningAlert">{{ warningAlert }}</b-alert>
      <b-alert show variant="info" dismissible @dismissed="infoAlert=null" v-if="infoAlert">{{ infoAlert }}</b-alert>

      <form @submit.prevent="handleSave">
        <field-editor v-for="(field,index) in module.fields"
                      :key="index"
                      :field="field"
                      :record="record" />
      </form>
    </section>
  </div>
</template>

<script>
import FieldEditor from '@/lib/field/Editor'
import Module from '@/lib/module'

export default {
  props: {
    moduleID: {
      type: String,
      required: true,
    },

    recordID: {
      type: String,
      required: false,
    },
  },

  data () {
    return {
      module: null,
      record: { fields: [] },

      warningAlert: null,
      infoAlert: null,
    }
  },

  mounted () {
    this.$crm.moduleRead({ moduleID: this.moduleID }).then(m => {
      this.module = new Module(m)

      if (this.recordID) {
        return this.$crm.moduleContentRead({
          moduleID: this.moduleID,
          contentID: this.recordID,
        }).then(record => {
          this.record = record
        })
      }
    }).catch(({ message }) => {
      this.warningAlert = message
    })
  },

  methods: {
    handleSave ({ closeOnSuccess = false } = {}) {
      let p

      if (this.record.contentID) {
        p = this.$crm.moduleContentEdit(this.record)
      } else {
        p = this.$crm.moduleContentCreate({ ...this.record, moduleID: this.moduleID })
      }

      p.then(() => {
        if (closeOnSuccess) {
          this.$router.push({ name: 'admin.modules.records' })
        }
      }).catch(({ message }) => {
        this.warningAlert = `Failed to save record: ${message}`
      })
    },
  },

  components: {
    FieldEditor,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

table {
  td {
    vertical-align: middle;
  }
}

.well {
  margin-bottom: 80px;
}

.alert {
  position: absolute;
  z-index: 1;
  width: 100%;
  box-shadow: 0 0 2px 0 rgba($appgrey, 0.75);
}
</style>

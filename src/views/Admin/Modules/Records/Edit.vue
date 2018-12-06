<template>
  <section class="container well" v-if="module">
    <router-link :to="{name: 'admin.modules.records'}" class="btn btn-url">Back to record list</router-link><br>
    <h2 v-if="!recordID">{{module.name}}: create entry</h2>
    <h2 v-else>{{module.name}}: edit entry</h2>

    <form @submit.prevent="handleSave">
      <field-editor v-for="(field,index) in module.fields"
                    :key="index"
                    :field="field"
                    :record="record" />
      <button type="submit" class="btn btn-dark large">Save entry</button>
      <router-link :to="{ name: 'admin.modules.records', params: { moduleID }}" class="btn large">Cancel</router-link>
    </form>
  </section>
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
      record: {},
      errors: [],
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
      this.errors = [message]
    })
  },

  methods: {
    handleSave () {
      let p

      if (this.record.contentID) {
        p = this.$crm.moduleContentEdit(this.record)
      } else {
        p = this.$crm.moduleContentCreate({ ...this.record, moduleID: this.moduleID })
      }

      p.catch(({ message }) => {
        this.errors = [message]
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
</style>

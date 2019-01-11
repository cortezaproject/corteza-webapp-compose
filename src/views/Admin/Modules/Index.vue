<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well table-responsive">
          <h2>List of modules</h2>
          <table class="table table-striped">
            <tbody>
              <tr v-for="(m, index) in modules" :key="index">
                <td>
                  <router-link :to="{name: 'admin.modules.edit', params: { moduleID: m.moduleID }}" class="btn-url">{{ m.name }}</router-link>
                </td>
                <td><time :datetime="m.updatedAt" v-if="m.updatedAt">{{ prettyDate(m.updatedAt || m.createdAt) }}</time></td>
                <td class="actions text-right">
                  <router-link
                    v-if="m.recordPage"
                    :to="{name: 'admin.pages.builder', params: { pageID: m.recordPage.pageID }}"
                    class="btn-url">Page builder</router-link>
                  <button
                     v-if="!m.recordPage"
                     @click="handleRecordPageCreation({ moduleID: m.moduleID })"
                     class="btn-url">Page builder</button>

                  <router-link :to="{name: 'admin.modules.edit', params: { moduleID: m.moduleID }}" class="action">
                    <i class="action icon-edit"></i>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
          <form @submit.prevent="create">
            <b-form-group label="Create a new module:">
              <b-input-group>
                <input required type="text" v-model="addModuleFormData.name" class="form-control" id="name" placeholder="Module name" />
                <b-input-group-append>
                  <button type="submit" class="btn btn-dark">Create</button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Field from '@/lib/field'

export default {
  name: 'ModuleList',
  data () {
    return {
      modules: [],
      addModuleFormData: {
        name: '',
        fields: [],
        meta: {},
      },
    }
  },

  created () {
    this.fetch()
  },

  methods: {
    fetch () {
      this.$crm.pageList({ recordPagesOnly: true }).then(pp => {
        this.$crm.moduleList({}).then(mm => {
          this.modules = mm.map(m => {
            m.recordPage = pp.find(p => p.moduleID === m.moduleID)
            return m
          })
        }).catch(this.defaultErrorHandler('Could not load module list'))
      }).catch(this.defaultErrorHandler('Could not load page list'))
    },

    create () {
      this.addModuleFormData.fields = [
        new Field({ name: 'sample', kind: 'text' }),
      ]

      this.$crm.moduleCreate(this.addModuleFormData).then((module) => {
        this.$router.push({ name: 'admin.modules.edit', params: { moduleID: module.moduleID } })
      }).catch(this.defaultErrorHandler('Could not create a module'))
    },

    handleRecordPageCreation ({ moduleID }) {
      // This is called from record pages list as a request to create a (record) page that
      // with reference to a module

      const module = this.modules.find(m => m.moduleID === moduleID)
      const payload = {
        title: `Record page for module "${module.name || moduleID}"`,
        moduleID,
      }

      this.$crm.pageCreate(payload).then(page => {
        this.$router.push({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }).catch(this.defaultErrorHandler('Could not create a page'))
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";

.btn {
  border-radius: 0;
}

.table {
  td {
    min-width: 100px;
    border-top: 0;
  }
}
</style>

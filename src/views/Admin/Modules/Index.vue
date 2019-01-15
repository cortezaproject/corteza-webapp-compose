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
                    v-if="recordPage(m.moduleID)"
                    :to="{name: 'admin.pages.builder', params: { pageID: recordPage(m.moduleID).pageID }}"
                    class="btn-url">Page builder</router-link>
                  <button
                     v-else
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
                <input required type="text" v-model="newModule.name" class="form-control" id="name" placeholder="Module name" />
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
import { mapGetters, mapActions } from 'vuex'
import Field from '@/lib/field'
import Module from '@/lib/module'

export default {
  name: 'ModuleList',
  data () {
    return {
      pages: [],
      newModule: new Module({ fields: [new Field({ name: 'sample', kind: 'text' })] }),
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    recordPage () {
      return (moduleID) => this.pages.find(p => p.moduleID === moduleID)
    },
  },

  created () {
    this.fetch()
  },

  methods: {
    ...mapActions({
      createModule: 'module/create',
    }),

    fetch () {
      this.$crm.pageList({ recordPagesOnly: true }).then(pp => {
        this.pages = pp
      }).catch(this.defaultErrorHandler('Could not load page list'))
    },

    create () {
      this.createModule(this.newModule).then((module) => {
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
        blocks: [],
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

form {
  margin-top: 50px;
}
</style>

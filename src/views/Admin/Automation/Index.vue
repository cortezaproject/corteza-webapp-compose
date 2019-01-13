<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="well table-responsive">
          <h2>List of triggers</h2>
          <table class="table table-striped">
            <tbody>
            <tr v-for="(t, index) in triggers" :key="index">
              <td>{{ t.name }}</td>
              <td>{{ t.enabled ? '' : 'disabled' }}</td>
              <td width="300"><small>{{ t.actions.join(', ') }}</small></td>
              <td><time :datetime="t.updatedAt || t.createdAt" v-if="t.updatedAt || t.createdAt">{{ prettyDate(t.updatedAt || t.createdAt) }}</time></td>
              <td class="actions text-right">
                <router-link :to="{name: 'admin.automation.edit', params: { triggerID: t.triggerID }}" class="action">
                  <i class="action icon-edit"></i>
                </router-link>
              </td>
            </tr>
            </tbody>
          </table>
          <form @submit.prevent="create">
            <b-form-group label="Create a new trigger">
              <b-input-group>
                <input required type="text" v-model="newTrigger.name" class="form-control" id="name" placeholder="Trigger name" />
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
import Trigger from '@/lib/trigger'

export default {
  data () {
    return {
      newTrigger: new Trigger(),
    }
  },

  computed: {
    ...mapGetters({
      triggers: 'trigger/set',
    }),
  },

  created () {
    this.loadTriggers({ force: true })
  },

  methods: {
    ...mapActions({
      loadTriggers: 'trigger/load',
      createTrigger: 'trigger/create',
    }),

    create () {
      this.createTrigger(this.newTrigger).then(t => {
        this.newTrigger = new Trigger()
        this.$router.push({ name: 'admin.automation.edit', params: { triggerID: t.triggerID } })
      })
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

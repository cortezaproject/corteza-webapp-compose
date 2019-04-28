<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well table-responsive">
            <div class="title-bar">
              <h2>{{ $t('automation.title')}}</h2>
              <div class="title-actions actions">
                <permission-modal id="triggerPermissions" filter="trigger" targetAll/>
              </div>
            </div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <table-sortable-column
                    :label="$t('general.label.name')"
                    name="name"
                    :ascending="sortedByName"
                    @sort="handleSort"/>

                  <table-sortable-column
                    :label="$t('general.label.status')"
                    name="enabled"
                    :ascending="sortedByEnabled"
                    @sort="handleSort"/>

                  <table-sortable-column
                    :label="$t('general.label.actions')"
                    name="actions"
                    :ascending="undefined"
                    :sortDisabled="true"/>

                  <table-sortable-column
                    :label="$t('general.label.updatedAt')"
                    name="updatedAt"
                    :ascending="sortedByUpdatedAt"
                    @sort="handleSort"/>

                  <th></th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="(t, index) in sortedTriggers" :key="index">
                <td>{{ t.name }}</td>
                <td>{{ $t(`automation.status.${t.enabled}`) }}</td>
                <td width="300"><small>{{ (t.actions || []).map(a => $t(`automation.triggerCondition.${a}`)).join(', ') }}</small></td>
                <td><time :datetime="t.updatedAt || t.createdAt" v-if="t.updatedAt || t.createdAt">{{ prettyDate(t.updatedAt || t.createdAt) }}</time></td>
                <td class="actions text-right">
                  <router-link :to="{name: 'admin.automation.edit', params: { triggerID: t.triggerID }}" class="action">
                    <i class="action icon-edit"></i>
                  </router-link>

                  <permission-modal :id="`permissions${index}`" filter="trigger" :target="t"  />
                </td>
              </tr>
              </tbody>
            </table>
            <form @submit.prevent="create">
              <b-form-group :label="$t(`automation.newLabel`)">
                <b-input-group>
                  <input required type="text" v-model="newTrigger.name" class="form-control" id="name" :placeholder="$t(`automation.newPlaceholder`)" />
                  <b-input-group-append>
                    <button type="submit" class="btn btn-dark">{{ $t(`general.label.create`) }}</button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Trigger from '@/lib/trigger'
import TableSortableColumn from '@/components/Admin/TableSortableColumn'
import PermissionModal from '@/components/Admin/Permissions/PermissionModal'
import tableSort from '@/mixins/table_sort'

export default {
  components: {
    TableSortableColumn,
    PermissionModal,
  },

  mixins: [
    tableSort,
  ],

  data () {
    return {
      newTrigger: new Trigger(),
    }
  },

  computed: {
    ...mapGetters({
      triggers: 'trigger/set',
    }),

    sortedByName () {
      return this.isSortedBy('name', true)
    },

    sortedByEnabled () {
      return this.isSortedBy('enabled')
    },

    sortedByUpdatedAt () {
      return this.isSortedBy('updatedAt')
    },

    sortedTriggers () {
      return this.sortedItems([...this.triggers])
    },
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

.title-actions {
  padding-bottom: 10px;
  margin-bottom: 0.5rem;
  line-height: 1;
  text-align: right;
  float: right;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 5px;
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

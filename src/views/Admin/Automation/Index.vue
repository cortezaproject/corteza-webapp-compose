<template>
  <div class="scrollable">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="well table-responsive">
            <div class="title-bar">
              <h2>{{ $t('automation.title')}}</h2>
              <div class="title-actions actions">
                <permissions-button v-if="namespace.canGrant" resource="compose:trigger:*" link />
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
                  <span v-if="t.canUpdateTrigger || t.canDeleteTrigger">
                    <router-link :to="{name: 'admin.automation.edit', params: { triggerID: t.triggerID }}" class="action">
                      <i class="action icon-edit"></i>
                    </router-link>
                  </span>

                  <permissions-button v-if="t.canGrant" :title="t.name" :resource="'compose:trigger:'+t.triggerID" link />
                </td>
              </tr>
              </tbody>
            </table>
            <form v-if="namespace.canCreateTrigger" @submit.prevent="create">
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
import tableSort from '@/mixins/table_sort'

export default {
  components: {
    TableSortableColumn,
  },

  mixins: [
    tableSort,
  ],

  props: {
    namespace: {
      type: Object,
      required: false,
    },
  },

  data () {
    const { namespaceID } = this.namespace
    return {
      newTrigger: new Trigger({ namespaceID }),
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
    const { namespaceID } = this.namespace
    this.loadTriggers({ namespaceID, force: true })
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

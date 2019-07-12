<template>
  <div class="mt-3">
    <b-container>
      <b-row>
        <b-col md="12">
          <b-card class="mb-2">
            <b-row align-v="center">
              <b-col md="5">
                <b-form v-if="namespace.canCreateTrigger" @submit.prevent="create">
                  <b-form-group :label="$t('trigger.newLabel')">
                    <b-input-group>
                      <input required type="text" v-model="newTrigger.name" class="form-control" id="name" :placeholder="$t('trigger.newPlaceholder')" />
                      <b-input-group-append>
                        <b-button type="submit" variant="dark">{{ $t('general.label.create') }}</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-form>
              </b-col>
              <b-col md="5">
                <import v-if="namespace.canCreateTrigger"
                        :namespace="namespace" type="trigger" />
              </b-col>
              <b-col md="2" class="text-right">
                <export :list="sortedTriggers" type="trigger" />
                <permissions-button v-if="namespace.canGrant"
                                    resource="compose:trigger:*"
                                    link />
              </b-col>
            </b-row>
          </b-card>
          <b-card :title="$t('trigger.title')">
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
                <td>{{ $t(`trigger.status.${t.enabled}`) }}</td>
                <td width="300"><small>{{ (t.actions || []).map(a => $t(`trigger.triggerCondition.${a}`)).join(', ') }}</small></td>
                <td><time :datetime="t.updatedAt || t.createdAt" v-if="t.updatedAt || t.createdAt">{{ prettyDate(t.updatedAt || t.createdAt) }}</time></td>
                <td class="text-right">
                  <span v-if="t.canUpdateTrigger || t.canDeleteTrigger">
                    <router-link :to="{name: 'admin.automation.edit', params: { triggerID: t.triggerID }}" class="text-dark pr-2">
                      <i class="icon-edit"></i>
                    </router-link>
                  </span>

                  <permissions-button v-if="t.canGrant" :title="t.name" :resource="'compose:trigger:'+t.triggerID" link />
                </td>
              </tr>
              </tbody>
            </table>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Trigger from 'corteza-webapp-compose/src/lib/trigger'
import TableSortableColumn from 'corteza-webapp-compose/src/components/Admin/TableSortableColumn'
import tableSort from 'corteza-webapp-compose/src/mixins/table_sort'
import Import from 'corteza-webapp-compose/src/components/Admin/Import'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'

export default {
  components: {
    TableSortableColumn,
    Import,
    Export,
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

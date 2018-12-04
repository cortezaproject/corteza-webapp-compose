<template>
  <div class="container">
    <filter-bar></filter-bar>
    <!-- vuetable :api-mode="false" ref="vuetable" :fields="fields" pagination-path="" :css="css.table" :sort-order="sortOrder" :multi-sort="true" detail-row-component="my-detail-row" :append-params="moreParams" @vuetable:cell-clicked="onCellClicked" @vuetable:pagination-data="onPaginationData" -->

      <vuetable ref="vuetable" api-url="https://vuetable.ratiw.net/api/users" :fields="fields" :sort-order="sortOrder" :css="css.table" pagination-path="" :per-page="8" @vuetable:pagination-data="onPaginationData" @vuetable:loading="onLoading" @vuetable:loaded="onLoaded">
    </vuetable>
    <div class="vuetable-pagination">
      <vuetable-pagination-info ref="paginationInfo" info-class="pagination-info"></vuetable-pagination-info>
      <vuetable-pagination ref="pagination" :css="css.pagination" @vuetable-pagination:change-page="onChangePage"></vuetable-pagination>
    </div>
  </div>

</template>

<script>
import moment from 'moment'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo'
import Vue from 'vue'
import VueEvents from 'vue-events'
import CustomActions from './CustomActions'
import DetailRow from './DetailRow'
import FilterBar from './FilterBar'
Vue.use(VueEvents)
Vue.component('custom-actions', CustomActions)
Vue.component('my-detail-row', DetailRow)
Vue.component('filter-bar', FilterBar)
export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
  },
  data () {
    return {
      css: {
        table: {
          tableClass: 'table table-bordered table-striped table-hover',
          ascendingIcon: 'glyphicon glyphicon-chevron-up',
          descendingIcon: 'glyphicon glyphicon-chevron-down',
        },
        pagination: {
          wrapperClass: 'pagination',
          activeClass: 'active',
          disabledClass: 'disabled',
          pageClass: 'page',
          linkClass: 'link',
          icons: {
            first: '',
            prev: '',
            next: '',
            last: '',
          },
        },
        icons: {
          first: 'glyphicon glyphicon-step-backward',
          prev: 'glyphicon glyphicon-chevron-left',
          next: 'glyphicon glyphicon-chevron-right',
          last: 'glyphicon glyphicon-step-forward',
        },
      },
      sortOrder: [{ field: 'email', sortField: 'email', direction: 'asc' }],
      moreParams: {},
      fields: [
        {
          name: 'name',
          title: '<span class="orange glyphicon glyphicon-user"></span> Full Name',
          sortField: 'name',
        },
        {
          name: 'email',
          title: 'Email',
          sortField: 'email',
        },
        'birthdate', 'nickname',
        {
          name: 'gender',
          title: 'Gender',
          sortField: 'gender',
        },
        '__slot:actions',
      ],
    }
  },
  props: ['list'],
  /* computed: {       // This is not working. We need to load the fields here, instead if inserting them directly as above...
    fields () {
      const result = this.list
      return result
    },
  }, */
  methods: {
    allcap (value) {
      return value.toUpperCase()
    },
    genderLabel (value) {
      return value === 'M'
        ? '<span class="label label-success"><i class="glyphicon glyphicon-star"></i> Male</span>'
        : '<span class="label label-danger"><i class="glyphicon glyphicon-heart"></i> Female</span>'
    },
    formatNumber (value) {
      return value
    },
    formatDate (value, fmt = 'D MMM YYYY') {
      return value == null ? '' : moment(value, 'YYYY-MM-DD').format(fmt)
    },
    onPaginationData (paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked (data, field, event) {
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    editRow (rowData) {
      alert('You clicked edit on' + JSON.stringify(rowData))
    },
    deleteRow (rowData) {
      alert('You clicked delete on' + JSON.stringify(rowData))
    },
    onLoading () {
      this.$logger.log('loading... show your spinner here')
    },
    onLoaded () {
      this.$logger.log('loaded! .. hide your spinner here')
    },
  },
  events: {
    'filter-set' (filterText) {
      this.moreParams = {
        filter: filterText,
      }
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    'filter-reset' () {
      this.moreParams = {}
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
  },
}
</script>

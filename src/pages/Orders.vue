/* eslint-disable vue/no-unused-vars */
<template>
  <q-page padding v-if="model">
    <q-table
      :data="model"
      :filter="filter"
      :visible-columns="visibleColumns"
      :separator="separator"
      :columns="columns"
      :pagination.sync="pagination"
      :no-data-label="'No se encontraron pedidos'"
      :grid="grid"
      row-key="id"
    >
      <template slot="top-left">
        <q-input
          debounce="500"
          v-model="filter"
        />
      </template>
      <template slot="top-right" slot-scope="props">
        <q-select
          color="secondary"
          class="q-mr-sm"
          v-model="visibleColumns"
          :columns="columns"
        />
        <q-select
          color="secondary"
          v-model="separator"
          :options="[
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
            { label: 'Cell', value: 'cell' },
            { label: 'None', value: 'none' }
          ]"
          hide-underline
        />
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
      </template>
        <q-td slot="body-cell-itemName" slot-scope="props" :props="props">
          <q-chip small color="primary">{{ props.value }}</q-chip>
        </q-td>
        <q-td slot="body-cell-urgent" slot-scope="props" :props="props">
          <q-btn round dense icon="alarm" :color="props.value ? 'primary' : 'terciary'" :text-color="props.value ? 'white' : 'grey'"></q-btn>
        </q-td>
        <q-td slot="body-cell-created_at" slot-scope="props" :props="props">
          {{ dateForHumans(props.value) }}
        </q-td>
        <q-td slot="body-cell-updated_at" slot-scope="props" :props="props">
          {{ dateForHumans(props.value) }}
        </q-td>
    </q-table>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'Orders',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelsNeeded: {
        orders: {
          scoped: true,
          refresh: false,
          cache: false,
          where: false
        }
      },
      columns: [],
      options: [],
      visibleColumns: [],
      separator: 'horizontal',
      filter: '',
      grid: false,
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 10 // current rows per page being displayed
      }
    }
  },
  computed: {
    model () {
      if (this.$store.state.Model.models['orders']) {
        return this.$store.state.Model.models['orders'].items
      }
      return []
    }
  },
  methods: {
    dateForHumans (oldDate) {
      let newDate = Date.now()
      let formattedString = 'Hace ' + date.getDateDiff(newDate, oldDate, 'days') + ' días'
      return formattedString
    },
    getTable () {
      this.$axios.get(this.$store.state.App.dataWarehouse + 'table/?model=orders').then(({ data }) => {
        this.columns = data.table.columns
        this.options = data.table.options
      }).then(() => {
        for (let column of this.columns) {
          this.visibleColumns.push(column.field)
        }
      })
    }
  },
  created () {
    this.getTable()
  }
}
</script>

<style>
</style>

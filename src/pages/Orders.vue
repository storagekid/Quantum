<template>
  <q-page class="q-pa-md">
    <model-table
      :sticky="true"
      :virtualScroll="true"
      :modelName="modelName"
      :dense="true"
      :getModelView="true"
      v-if="modelsReady"
      >
      <template slot="body-cell-priority" slot-scope="data" :data="data">
        <div v-if="data.item === 3">
          <q-badge outline color="primary">
            <table-cell
              :row="data.row"
              :name="data.column.name"
              :column="data.column"
              >
            </table-cell>
          </q-badge>
        </div>
        <div v-else-if="data.item === 2">
          <q-badge color="primary">
            <table-cell
              :row="data.row"
              :name="data.column.name"
              :column="data.column"
              >
            </table-cell>
          </q-badge>
        </div>
        <div v-else>
          <q-badge color="negative">
            <table-cell
              :row="data.row"
              :name="data.column.name"
              :column="data.column"
              >
            </table-cell>
          </q-badge>
        </div>
      </template>
      <template slot="body-cell-state" slot-scope="data" :data="data">
        <div v-if="data.item === 6">
          <q-badge color="negative">
            <table-cell
              :row="data.row"
              :name="data.column.name"
              :column="data.column"
              >
            </table-cell>
            <q-icon name="close" class="q-ml-xs"></q-icon>
          </q-badge>
        </div>
        <div v-else-if="data.item === 5">
          <q-badge color="positive">
            <table-cell
              :row="data.row"
              :name="data.column.name"
              :column="data.column"
              >
            </table-cell>
            <q-icon name="done" class="q-ml-xs"></q-icon>
          </q-badge>
        </div>
        <div v-else-if="data.item === 4">
          <q-badge color="primary">
            <table-cell
              :row="data.row"
              :name="data.column.name"
              :column="data.column"
              >
            </table-cell>
          </q-badge>
        </div>
        <div v-else-if="data.item === 3">
          <q-badge outline="" color="info">
            <table-cell
              :row="data.row"
              :name="data.column.name"
              :column="data.column"
              >
            </table-cell>
          </q-badge>
        </div>
        <div v-else-if="data.item === 2">
          <q-badge outline color="info">
            <table-cell
              :row="data.row"
              :name="data.column.name"
              :column="data.column"
              >
            </table-cell>
          </q-badge>
        </div>
        <div v-else>
          <q-badge outline color="primary">
            <table-cell
              :row="data.row"
              :name="data.column.name"
              :column="data.column"
              >
            </table-cell>
          </q-badge>
        </div>
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'
import TableCell from '../components/table/tableCell'

export default {
  name: 'orders',
  components: { TableCell },
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'orders',
      modelsNeeded: {
        orders: {
          full: true,
          scoped: true,
          refresh: true,
          orderBy: 'created_at',
          orderDesc: true
        }
      }
    }
  }
}
</script>

<style>
</style>

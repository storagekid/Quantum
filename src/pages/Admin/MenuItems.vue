<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :dense="true"
      v-if="modelsReady"
      >
      <template slot="body-cell-parent.name" slot-scope="data" :data="data">
        <q-chip dense square color="secondary" text-color="primary" v-if="data.item">{{ data.item }}</q-chip>
      </template>
      <template slot="body-cell-icon" slot-scope="data" :data="data">
        <q-icon :name="data.item" color="accent" size="md" style="font-size:1.5em"></q-icon>
      </template>
      <template slot="body-cell-groups" slot-scope="data" :data="data">
        <template v-if="data.item.length">
          <div v-for="(item, index) in data.item" :key="index">
            <q-chip size="sm" dense square color="positive" text-color="white">{{ item.name }}</q-chip>
          </div>
        </template>
        <div v-else></div>
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'MenuItems',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'menu_items',
      modelsNeeded: {
        menu_items: {
          full: true
        }
      }
    }
  }
}
</script>

<style>
</style>

<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :permissions="permissions"
      :dense="true"
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
      <template slot="body-cell-parent.name" slot-scope="item" :item="item">
        <q-chip dense square color="secondary" text-color="primary" v-if="item.item">{{ item.item }}</q-chip>
      </template>
      <template slot="body-cell-icon" slot-scope="item" :item="item">
        <q-icon :name="item.item" color="accent" size="md" style="font-size:1.5em"></q-icon>
      </template>
      <template slot="body-cell-children" slot-scope="item" :item="item">
        <template v-if="item.item.length">
          <template v-for="(item, index) in item.item">
            <div :key="index">
              <q-chip dense square color="secondary" text-color="primary">{{ item.name }}</q-chip>
            </div>
          </template>
        </template>
        <div v-else></div>
      </template>
      <template slot="body-cell-groups" slot-scope="item" :item="item">
        <template v-if="item.item.length">
          <div v-for="(item, index) in item.item" :key="index">
            <q-chip dense square color="positive" text-color="white">{{ item.name }}</q-chip>
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

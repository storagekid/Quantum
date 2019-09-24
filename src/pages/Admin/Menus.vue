<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :permissions="permissions"
      :dense="true"
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'Menus',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'menus',
      modelsNeeded: {
        menus: {
          full: true,
          withCount: ['menu_items']
        }
      }
    }
  }
}
</script>

<style>
</style>

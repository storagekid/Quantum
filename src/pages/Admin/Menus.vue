<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :dense="true"
      v-if="modelsReady"
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

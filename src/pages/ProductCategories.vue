<template>
  <q-page class="q-pa-md">
    <model-table
      dense
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      v-if="modelsReady"
      >
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'ProductCategories',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'product_categories',
      modelsNeeded: {
        product_categories: {
        }
      }
    }
  }
}
</script>

<style>
</style>

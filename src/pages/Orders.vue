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
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'orders',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'orders',
      modelsNeeded: {
        orders: {
          full: true,
          scoped: true,
          refresh: true
        }
      }
    }
  }
}
</script>

<style>
</style>

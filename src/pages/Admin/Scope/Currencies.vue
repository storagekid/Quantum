<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :dense="true"
      :getModelView="true"
      :rows="20"
      v-if="modelsReady"
      >
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../../../mixins/modelMixin'

export default {
  name: 'scope-currencies',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'currencies',
      modelsNeeded: {
        currencies: {
          full: true
        }
      }
    }
  }
}
</script>

<style>
</style>

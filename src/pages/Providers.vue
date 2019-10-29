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
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'providers',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'providers',
      modelsNeeded: {
        providers: {
          full: true,
          refresh: true
        }
      }
    }
  }
}
</script>

<style>
</style>

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
  name: 'service-providers',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'service_providers',
      modelsNeeded: {
        service_providers: {
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

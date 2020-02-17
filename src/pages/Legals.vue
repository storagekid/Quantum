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
  name: 'legals',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'legals',
      modelsNeeded: {
        legals: {
          full: true
        }
      }
    }
  }
}
</script>

<style>
</style>

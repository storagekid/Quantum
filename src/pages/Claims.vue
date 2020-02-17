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
  name: 'claims',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'claims',
      modelsNeeded: {
        claims: {
          full: true,
          refresh: true,
          appends: ['current_legal'],
          withCount: ['legals']
        }
      }
    }
  }
}
</script>

<style>
</style>

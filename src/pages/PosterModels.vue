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
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'PosterModels',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'poster_models',
      modelsNeeded: {
        poster_models: {
          refresh: true,
          full: true
        },
        campaigns: {
        }
      }
    }
  }
}
</script>

<style>
</style>

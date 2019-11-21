<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :dense="true"
      v-if="modelsReady"
      >
      <template slot="body-cell-sanitary_codes" slot-scope="item" :item="item">
        {{ item.item.length }}
      </template>
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

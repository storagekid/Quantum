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
import { ModelsFetcher } from '../../../mixins/modelMixin'

export default {
  name: 'scope-companies',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'companies',
      modelsNeeded: {
        companies: {
        }
      }
    }
  }
}
</script>

<style>
</style>

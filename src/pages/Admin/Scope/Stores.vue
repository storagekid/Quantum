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
  name: 'scope-stores',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'stores',
      modelsNeeded: {
        stores: {
        }
      }
    }
  }
}
</script>

<style>
</style>

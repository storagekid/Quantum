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
  name: 'scope-clinics',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'clinics',
      modelsNeeded: {
        clinics: {
        }
      }
    }
  }
}
</script>

<style>
</style>

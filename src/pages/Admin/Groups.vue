<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      v-if="modelsReady"
      >
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'GroupsPage',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'groups',
      modelsNeeded: {
        groups: {
          withCount: ['users']
        }
      }
    }
  }
}
</script>

<style>
</style>

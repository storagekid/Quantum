<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :dense="true"
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
      <template slot="body-cell-sanitizable_type" slot-scope="item" :item="item">
        {{ item.item.substring(item.item.indexOf('\\')+1) }}
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'SanitaryCodes',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'sanitary_codes',
      modelsNeeded: {
        sanitary_codes: {
          scoped: false,
          refresh: false,
          cache: false,
          where: false,
          full: true
        },
        campaigns: {
          scoped: false,
          refresh: false,
          cache: false,
          where: false,
          full: true
        }
      },
      modelSelected: null
    }
  }
}
</script>

<style>
</style>

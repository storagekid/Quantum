<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :dense="true"
      :getModelView="true"
      :rows="20"
      v-if="modelsReady"
      >
      <template slot="body-cell-countries" slot-scope="item" :item="item">
        <template v-if="item.item.length">
          <div v-for="(country, index) in item.item" :key="index">
              <span class="text-bold text-italic text-caption">{{ country.name }}</span>
          </div>
        </template>
        <template v-else>
          <div>-</div>
        </template>
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../../../mixins/modelMixin'

export default {
  name: 'scope-currencies',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'currencies',
      modelsNeeded: {
        currencies: {
          full: true
        }
      }
    }
  }
}
</script>

<style>
</style>

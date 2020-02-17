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
      <template slot="body-cell-product_providers" slot-scope="item" :item="item">
        <template v-if="item.item.length">
          <div v-for="(pp, index) in item.item" :key="index">
              <span class="text-bold text-italic text-caption">{{ pp.provider.name }}</span>
              <span class="text-bold text-italic text-caption text-red" v-if="pp.country_id"> - {{ $store.state.Model.models.countries.items.filter(i => i.id === pp.country_id)[0].name }}</span>
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
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'products',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'products',
      modelsNeeded: {
        products: {
          full: true,
          refresh: true
        },
        product_categories: {
          full: true,
          refresh: true
        }
      }
    }
  }
}
</script>

<style>
</style>

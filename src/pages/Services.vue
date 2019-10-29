<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :dense="true"
      :getModelView="true"
      :rows="20"
      v-if="modelsReady"
      >
      <template slot="body-cell-service_providers" slot-scope="item" :item="item">
        <template v-if="item.item.length">
          <div v-for="(sp, index) in item.item" :key="index">
              <span class="text-bold text-italic text-caption">{{ sp.provider.name }}</span>
              <span class="text-bold text-italic text-caption text-red" v-if="sp.clinic_id"> - {{ $store.state.Model.models.clinics.items.filter(i => i.id === sp.clinic_id)[0].name }}</span>
              <span class="text-bold text-italic text-caption text-red" v-else-if="sp.store_id"> - {{ $store.state.Model.models.stores.items.filter(i => i.id === sp.store_id)[0].name }}</span>
              <span class="text-bold text-italic text-caption text-red" v-else-if="sp.county_id"> - {{ $store.state.Model.models.counties.items.filter(i => i.id === sp.county_id)[0].name }}</span>
              <span class="text-bold text-italic text-caption text-red" v-else-if="sp.state_id"> - {{ $store.state.Model.models.states.items.filter(i => i.id === sp.state_id)[0].name }}</span>
              <span class="text-bold text-italic text-caption text-red" v-if="sp.country_id"> - {{ $store.state.Model.models.countries.items.filter(i => i.id === sp.country_id)[0].name }}</span>
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
  name: 'services',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'services',
      modelsNeeded: {
        services: {
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

<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :dense="true"
      :getModelView="true"
      :rows="20"
      v-if="modelsReady"
      >
      <template slot="body-cell-clinic.nickname" slot-scope="item" :item="item">
            <span class="text-bold text-primary">{{ item.item ? item.item : '-' }}</span>
      </template>
      <template slot="body-cell-clinic_af.thumbnail" slot-scope="item" :item="item">
        <div v-if="item.item">
          <q-img style="max-height: 100px" contain :src="$store.state.App.publicSources + '/' + item.item">
          </q-img>
          <q-tooltip self="center left" anchor="center left" content-style="min-width: 600px; max-height: 600px display: flex">
            <q-img :src="$store.state.App.publicSources + '/' + item.item">
            </q-img>
          </q-tooltip>
        </div>
        <div v-else>
          {{ '*' }}
        </div>
      </template>
      <template slot="body-cell-total_price" slot-scope="item" :item="item">
            <span class="text-bold text-primary">{{ item.item ? item.item : '-' }}</span>
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'clinic_mailings',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'clinic_mailings',
      modelsNeeded: {
        'clinic_mailings': {
          full: true,
          appends: ['distributed_total_qty', 'printer_total_price', 'distributor_total_price', 'total_price']
        }
      }
    }
  }
}
</script>

<style>
</style>
